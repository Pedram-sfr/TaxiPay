const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const driverModel = require("./driver.model");
const { Types, mongo } = require("mongoose");

class DriverService {
  #model;
  constructor() {
    autoBind(this);
    this.#model = driverModel;
  }

  async getDriver(driverCode) {
    const driver = await this.#model.findOne(
      { driverCode },
      {
        _id: 0,
        driverCode: 1,
        priceDetail: 1,
        fullName: 1,
        car: 1,
        pellak: 1,
        image: 1
      }
    );
    if (!driver) throw createHttpError.NotFound();
    return driver;
  }

  async getUserProfile(userId) {
    const user = await this.#model.aggregate([
      { $match: { _id: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "wallets",
          foreignField: "userId",
          localField: "_id",
          as: "wallet",
        },
      },
      {
        $unwind: {
          path: "$wallet",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          walletBalance: "$wallet.balance",
        },
      },
      {
        $project: {
          _id: 0,
          createdAt: 0,
          updatedAt: 0,
          wallet: 0,
          password: 0,
        },
      },
    ]);
    if (!user) throw new createHttpError.NotFound("کاربر یافت نشد");
    return user;
  }
  async updateUserProfile(userId, dto) {
    const user = await this.#model.find({ _id: userId });
    if (!user) throw new createHttpError.NotFound("کاربر یافت نشد");
    const res = await this.#model.updateOne(
      { _id: userId },
      {
        $set: {
          ...dto,
        },
      }
    );
    if (res.modifiedCount == 0)
      throw new createHttpError.InternalServerError("خطا سرور");
    return true;
  }
  async priceDetailList(userId) {
    const user = await this.#model.findOne(
      { _id: userId },
      { _id: 0, priceDetail: 1 }
    );
    if (!user) throw new createHttpError.NotFound("کاربر یافت نشد");
    return user;
  }
  async priceDetailEdit(userId, dto) {
    const user = await this.#model.findOne(
      { _id: userId },
      { _id: 0, priceDetail: 1 }
    );
    if (!user) throw new createHttpError.NotFound("کاربر یافت نشد");
    const res = await this.#model.updateOne(
      { _id: userId },
      {
        $push: {
          priceDetail: { ...dto },
        },
      }
    );
    if (res.modifiedCount == 0) throw createHttpError.InternalServerError(data);
    return res;
  }
  async priceDetailRemove(userId, priceDetailId) {
    const user = await this.#model.findOne(
      { _id: userId },
      { _id: 0, priceDetail: 1 }
    );
    if (!user) throw new createHttpError.NotFound("کاربر یافت نشد");
    const res = await this.#model.updateOne(
      { _id: userId },
      {
        $pull: {
          priceDetail: {
            _id: priceDetailId,
          },
        },
      }
    );
    if (res.modifiedCount == 0) throw createHttpError.InternalServerError(data);
    return res;
  }
}

module.exports = new DriverService();
