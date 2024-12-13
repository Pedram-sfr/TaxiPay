const autoBind = require("auto-bind");
const { walletModel } = require("./wallet.model");
const { cardToSheba } = require("../common/utils/http");
const createHttpError = require("http-errors");
const PaymentModel = require("./payment.model");
const { default: axios } = require("axios");
const { codeGen } = require("../common/function/function");
const redisClient = require("../config/initRedis");
const URL = require("url");
const driverModel = require("../DRIVER/modules/driver/driver.model");
const { Types } = require("mongoose");

class WalletService {
  #model;
  #paymentModel;
  #driverModel;
  constructor() {
    autoBind(this);
    this.#model = walletModel;
    this.#paymentModel = PaymentModel;
    this.#driverModel = driverModel;
  }

  async getUserWallet(userId) {
    const wallet = this.#model.find(
      { userId },
      { createdAt: 0, updatedAt: 0, userId: 0 }
    );
    if (!wallet) throw new createHttpError.NotFound("کاربر یافت نشد");
    return wallet;
  }
  async cardToSheba(card_number) {
    const { status_code, response_body } = await cardToSheba(card_number);
    if (status_code === 200) return response_body;
    else throw createHttpError.InternalServerError();
  }
  async editUserWallet(userId, dto) {
    const wallet = await this.#model.findOne({ userId });
    if (!wallet) throw new createHttpError.NotFound("کاربر یافت نشد");
    // user.wallet.IBAN = IBAN;
    // user.wallet.IBANName = IBANName;
    // user.wallet.IBANBank = IBANBank;
    // user.wallet.cardNum = cardNum;
    // user.save();
    console.log(wallet, dto);
    const res = await this.#model.updateOne(
      { userId },
      {
        $set: {
          ...dto,
        },
      }
    );
    console.log(res);
    if (res.modifiedCount == 0)
      throw new createHttpError.InternalServerError("خطا سرور");
    return true;
  }

  async chargeWalletGateway(userId, mobile, amount, callback) {
    const wallet = await this.#model.findOne({ userId });
    if (!wallet) throw createHttpError.NotFound();
    const requestOption = {
      merchant: "zibal",
      amount,
      callbackUrl: `${process.env.BASE_URL}/transactions/gateway/verify`,
      description: `شارژ گیف پول به مبلغ ${amount}`,
      mobile,
    };
    const { result, trackId } = await axios
      .post(`${process.env.ZIBAL_URL}/v1/request`, requestOption)
      .then((result) => result.data);
    if (result == 100 && trackId) {
      await this.#paymentModel.create({
        trackId,
        userId,
        amount,
      });
      const GateWayUrl = `https://gateway.zibal.ir/start/${trackId}`;
      console.log(callback);
      await redisClient.set(
        String(trackId),
        callback,
        { EX: 60 * 30 },
        (err) => {
          if (err) return err.message;
        }
      );
      return GateWayUrl;
    } else throw createHttpError.InternalServerError();
  }

  async gatewayVerify(statusCode, trackId, success) {
    const url = await redisClient.get(trackId);
    let callbackUrl = URL.parse(url, true, true);
    callbackUrl.search = null;
    const requestOption = {
      merchant: "zibal",
      trackId,
    };
    const {
      paidAt,
      amount,
      result,
      status: VstatusCode,
      description,
      cardNumber,
      message,
    } = await axios
      .post(`${process.env.ZIBAL_URL}/v1/verify`, requestOption)
      .then((result) => result.data);
    const pay = await this.#paymentModel.findOne({ trackId });
    if (success == 1 && (statusCode == 1 || statusCode == 2)) {
      const refNumber = codeGen();
      const wallet = await this.#model.findOne({ userId: pay.userId });
      console.log(result);
      if (result == 100) {
        await this.#paymentModel.updateOne(
          { trackId },
          {
            $set: {
              paidAt,
              status: true,
              refNumber,
              description,
              cardNumber,
              statusCode: VstatusCode,
              result,
            },
          }
        );
        const walletDetail = {
          RefNo: refNumber,
          amount: pay.amount,
          commission: 0,
          paymentId: pay._id,
          state: "INCREMENT",
          status: true,
          description: `شارژ گیف پول به مبلغ ${pay.amount}`,
        };
        const res = await this.#model.updateOne(
          { userId: pay.userId },
          {
            balance: wallet.balance + pay.amount,
            $push: {
              detail: walletDetail,
            },
          }
        );
        if (res.modifiedCount == 0) throw createHttpError.BadRequest();

        callbackUrl.query.amount = amount;
        callbackUrl.query.paidAt = String(paidAt);
        callbackUrl.query.refNumber = pay.refNumber;
        callbackUrl.query.status = true;
        callbackUrl = URL.format(callbackUrl);
        await redisClient.del(trackId);
        return callbackUrl;
      } else if (result == 201) {

        callbackUrl.query.amount = pay.amount;
        callbackUrl.query.paidAt = String(pay.paidAt);
        callbackUrl.query.refNumber = pay.refNumber;
        callbackUrl.query.status = true;
        callbackUrl = URL.format(callbackUrl);
        await redisClient.del(trackId);
        return callbackUrl;
      } else {
        callbackUrl.query.amount = pay.amount;
        callbackUrl.query.status = false;
        callbackUrl = URL.format(callbackUrl);
        await redisClient.del(trackId);
        return callbackUrl;
      }
    } else {
      callbackUrl.query.amount = pay.amount;
      callbackUrl.query.status = false;
      callbackUrl = URL.format(callbackUrl);
      await redisClient.del(trackId);
      return callbackUrl;
    }
  }

  async payBillWithWallet(userId, driverCode, lineId, nop) {
    const { priceDetail, fullName } = await this.#driverModel.findOne(
      {
        driverCode,
        "priceDetail._id": lineId,
      },
      { "priceDetail.$": 1, fullName: 1 }
    );
    const driver = await this.#driverModel.findOne({
      driverCode,
    });
    const line = priceDetail[0];
    if (!line) throw createHttpError.NotFound();
    const { balance } = await this.#model.findOne({ userId });
    const { balance: balanceD } = await this.#model.findOne({
      userId: driver._id,
    });
    const amount = line.amount * nop;
    if (amount > balance) throw createHttpError.BadRequest("موجودی کافی نیست");
    const walletUserDetail = {
      RefNo: codeGen(),
      amount,
      commission: 0,
      state: "PAYMENT",
      status: true,
      description: `پرداخت مبلغ ${amount} تومان به ${fullName}`,
      priceDetail: {
        title: line.title,
        price: line.amount,
        nop,
      },
    };
    const walletDriverDetail = {
      RefNo: codeGen(),
      amount,
      commission: amount * 0.05,
      state: "PAYMENT",
      status: true,
      description: `پرداخت کرایه خط ${line.title} به مبلغ ${amount} تومان`,
      priceDetail: {
        title: line.title,
        price: line.amount,
        nop,
      },
    };
    await this.addWalletDetail(userId, walletUserDetail, balance, amount, "DE");
    const res = await this.addWalletDetail(
      driver._id,
      walletDriverDetail,
      balanceD,
      amount - amount * 0.05,
      "IN"
    );
    
    return {refNumber: walletUserDetail.RefNo,amount: walletUserDetail.amount,title: walletUserDetail.priceDetail.title,driverCode,paidAt: new Date().toUTCString()};
  }

  async addWalletDetail(userId, data, balanceP, amount, type) {
    if (type === "IN") {
      const res = await this.#model.updateOne(
        { userId },
        {
          balance: balanceP + amount,
          $push: {
            detail: data,
          },
        }
      );
      if (res.modifiedCount == 0) throw createHttpError.BadRequest();
      return res;
    } else if (type === "DE") {
      const res = await this.#model.updateOne(
        { userId },
        {
          balance: balanceP - amount,
          $push: {
            detail: data,
          },
        }
      );
      if (res.modifiedCount == 0) throw createHttpError.BadRequest();
      return true;
    }
  }
}

module.exports = new WalletService();
