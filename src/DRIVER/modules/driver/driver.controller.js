const autoBind = require("auto-bind");
const path = require("path");
const driverService = require("./driver.service");

class DriverController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = driverService;
  }

  async getDriver(req, res, next) {
    try {
      const { driverCode } = req.params;
      const driver = await this.#service.getDriver(driverCode);
      return res.status(200).json({
        statusCode: 200,
        data: driver,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async profile(req, res, next) {
    try {
      const { userId } = req.user;
      const user = await this.#service.getUserProfile(userId);
      return res.status(200).json({
        statusCode: 200,
        data: user,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async editProfile(req, res, next) {
    try {
      const { userId } = req.user;
      const dp = req.body;
      if (dp?.fileUploadPath && dp?.filename) {
        req.body.image = path
          .join(dp?.fileUploadPath, dp?.filename)
          .replace(/\\/gi, "/");
      }
      const { car, pellak, image } = dp;
      await this.#service.updateUserProfile(userId,{car,pellak,image});
      return res.status(200).json({
        statusCode: 200,
        data: {
          message: "باموفقیت ذخیره شد",
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async priceDetailList(req, res, next) {
    try {
      const { userId } = req.user;
      const data = await this.#service.priceDetailList(userId);
      return res.status(200).json({
        statusCode: 200,
        data,
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async updatePriceDetail(req, res, next) {
    try {
      const { userId } = req.user;
      const {title, amount} = req.body;
      await this.#service.priceDetailEdit(userId,{title, amount});
      return res.status(200).json({
        statusCode: 200,
        data:{
          message: "success"
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
  async removePriceDetail(req, res, next) {
    try {
      const { userId } = req.user;
      const {priceDetailId} = req.body;
      await this.#service.priceDetailRemove(userId,priceDetailId);
      return res.status(200).json({
        statusCode: 200,
        data:{
          message: "remove successfuly"
        },
        error: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DriverController();
