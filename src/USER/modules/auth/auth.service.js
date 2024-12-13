const autoBind = require("auto-bind");
const userModel = require("../user/user.model");
const redisClient = require("../../../config/initRedis");
const createHttpError = require("http-errors");
const { randomInt } = require("crypto");
const jwt = require("jsonwebtoken");
const { UserMessage } = require("../user.message");
const { walletModel } = require("../../../WALLET/wallet.model");

class AuthService {
  #model;
  #walletmodel
  constructor() {
    autoBind(this);
    this.#model = userModel;
    this.#walletmodel = walletModel
  }

  async sendOtp(mobile) {
    const otpCode = await redisClient.get(mobile);
    if (otpCode)
      throw new createHttpError.BadRequest(UserMessage.OTPCodeNotExpired);
    const code = randomInt(10000, 99999);
    await redisClient.set(String(mobile), code, { EX: 120 }, (err) => {
      return err?.message || "InternalError";
    });
    return code;
  }
  async checkOtp(mobile, code) {
    let token;
    const user = await this.#model.findOne({ mobile });
    const otpCode = await redisClient.get(mobile);
    if (!otpCode)
      throw new createHttpError.BadRequest(UserMessage.OTPCodeExpired);
    if (otpCode !== code)
      throw new createHttpError.BadRequest(UserMessage.OTPCodeInCorrect);
    if (!user) {
      const newUser = await this.#model.create({ mobile , wallet: {balance: 0} });
      if(!newUser) throw createHttpError.InternalServerError();
      const wallet = await this.#walletmodel.create({userId: newUser._id})
      console.log(wallet)
      if(!wallet) {
        await this.#model.deleteOne({userId: newUser._id})
        throw createHttpError.InternalServerError();
      }
      token = this.signToken({ mobile, userId: newUser._id });
      redisClient.del(mobile);
    } else {
      token = this.signToken({ mobile, userId: user._id });
      redisClient.del(mobile);
    }
    return token;
  }
  async signToken(payload) {
    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);
    return { accessToken, refreshToken };
  }
  signAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
  }
  signRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESHSECRET_KEY, {
      expiresIn: "365d",
    });
  }

  async verifyRefreshToken(token) {
    const jwtr = jwt.verify(
        token,
        process.env.JWT_REFRESHSECRET_KEY)
    const block = await redisClient.get(jwtr?.userId);
    if(block) throw new createHttpError.Unauthorized();
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        process.env.JWT_REFRESHSECRET_KEY,
        async (err, payload) => {
          if (err)
            return reject(
              createHttpError.Unauthorized(UserMessage.TokenIsInvalid)
            );
          const { mobile, userId } = payload || {};
          const user = await this.#model.findOne(
            { mobile },
            {
              updatedAt: 0,
              createdAt: 0,
              _id: 0,
            }
          ).lean();
          if (!user)
            throw new createHttpError.Unauthorized(UserMessage.NotFound);
          resolve({ mobile, userId });
        }
      );
    });
  }
}

module.exports = new AuthService();
