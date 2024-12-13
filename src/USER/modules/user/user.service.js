const autoBind = require("auto-bind");
const userModel = require("./user.model");
const createHttpError = require("http-errors");
const { cardToSheba } = require("../../../common/utils/http");
const { Types } = require("mongoose");

class UserServcice {
  #model;
  constructor() {
    autoBind(this);
    this.#model = userModel;
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
        },
      },
    ]);
    if (!user) throw new createHttpError.NotFound("کاربر یافت نشد");
    return user;
  }
  async updateUserProfile(userId, fullName) {
    const user = await this.#model.find({ _id: userId });
    if (!user) throw new createHttpError.NotFound("کاربر یافت نشد");
    const res = await this.#model.updateOne(
      { _id: userId },
      { ...user, fullName }
    );
    if (res.modifiedCount == 0)
      throw new createHttpError.InternalServerError("خطا سرور");
    return true;
  }
}

module.exports = new UserServcice();
