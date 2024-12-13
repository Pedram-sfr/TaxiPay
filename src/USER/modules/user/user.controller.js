const autoBind = require("auto-bind");
const userService = require("./user.service");

class UserController {
  #service;
  constructor() {
    autoBind(this);
    this.#service = userService;
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
      const { fullName } = req.body;
      await this.#service.updateUserProfile(userId, fullName);
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
  
}

module.exports = new UserController();
