const autoBind = require("auto-bind");
const walletService = require("./wallet.service");
const redisClient = require("../config/initRedis");

class WalletController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = walletService;
  }

  async userWallet(req, res, next) {
    try {
      const { userId } = req.user;
      const data = await this.#service.getUserWallet(userId);
      return res.status(200).json({
        statusCode: 200,
        data,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }

  async cardToSheba(req, res, next) {
    try {
      const { card_number } = req.body;
      const { data } = await this.#service.cardToSheba(card_number);
      const name = data.name;
      data.name = name.split(" / ")[0];
      data.cardNumber = card_number;
      return res.status(200).json({
        statusCode: 200,
        data,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async editUserWallet(req, res, next) {
    try {
      const { userId } = req.user;
      const {
        name: IBANName,
        IBAN,
        bankName: IBANBank,
        cardNumber: cardNum,
      } = req.body;

      const data = await this.#service.editUserWallet(userId, {
        IBAN,
        IBANName,
        IBANBank,
        cardNum,
      });
      return res.status(200).json({
        statusCode: 200,
        data: {
          message: "با موفقیت ویرایش شد",
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async chargeWallet(req, res, next) {
    try {
      const { userId, mobile } = req.user;
      const { amount, chargeType, callbackUrl, redirectUrl } = req.body;
      const data = await this.#service.chargeWalletGateway(
        userId,
        mobile,
        amount,
        callbackUrl
      );
      return res.status(200).json({
        statusCode: 200,
        data,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async gatewayVerify(req, res, next) {
    try {
      const { status: statusCode, trackId, success } = req.query;
      const callbackUrl = await this.#service.gatewayVerify(
        statusCode,
        trackId,
        success
      );
      res.redirect(callbackUrl)
      // return res.status(200).json({
      //   statusCode: 200,
      //   data: callbackUrl,
      //   error: null,
      // });
    } catch (error) {
      next(error);
    }
  }
  async redirectUrl(req, res, next) {
    try {
      const {userId } = req.user
      const url = await redisClient.get(userId);
      await redisClient.del(userId);
      console.log(url);
      
      if(url)
        return res.status(200).json({
          statusCode: 200,
          data: url,
          error: null
        });
      return res.status(200).json({
        statusCode: 404,
        data: null,
        error: {
          message: "یافت نشد"
        }
      });
    } catch (error) {
      next(error);
    }
  }
  async payBill(req, res, next) {
    try {
      const {userId} = req.user;
      const {driverCode: code,lineId, nop} = req.body;
      const {refNumber,amount,title,driverCode,paidAt} = await this.#service.payBillWithWallet(userId,code,lineId,nop)
      const data = `/driverBill/${driverCode}?refNumber=${refNumber}&amount=${amount}&title=${title}&paidAt=${paidAt}`
      console.log(data);
      
      return res.status(200).json({
        statusCode: 200,
        data,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  // async editUserWallet(req, res, next) {
  //   try {

  //     return res.status(200).json({
  //       statusCode: 200,
  //       data: {
  //           message: "با موفقیت ویرایش شد"
  //       },
  //       error: null,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}

module.exports = new WalletController();
