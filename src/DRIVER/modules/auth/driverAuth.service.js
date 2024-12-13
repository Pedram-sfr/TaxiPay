const autoBind = require("auto-bind");
const redisClient = require("../../../config/initRedis");
const createHttpError = require("http-errors");
const { randomInt } = require("crypto");
const jwt = require("jsonwebtoken");
const { DriverMessage } = require("../driver.message");
const { walletModel } = require("../../../WALLET/wallet.model");
const driverModel = require("../driver/driver.model");
const bcrypt = require("bcrypt")
const { codeGenForDriver, isFalse } = require("../../../common/function/function");

class DriverAuthService {
  #model;
  #walletmodel
  constructor() {
    autoBind(this);
    this.#model = driverModel;
    this.#walletmodel = walletModel
  }

  async login(mobile,password) {
    const user =await this.#model.findOne({mobile});
    if(!user) throw new createHttpError.Unauthorized("شماره موبایل یا رمزعبور اشتباه است");
    const compare = await this.compareHashPassword(password,user?.password)
    if(isFalse(compare)) throw new createHttpError.Unauthorized("شماره موبایل یا رمزعبور اشتباه است");
    const token = this.signToken({ mobile, userId: user._id });
    return token;
  }
  async registerDriver(mobile,password,fullName,nationalCode) {
    let token;
    const driver = await this.#model.findOne({mobile,nationalCode});
    if(driver) throw createHttpError.BadRequest("کاربر وجود دارد");
    const hashedPassword = await this.createHashPassword(password);
    const driverCode = codeGenForDriver();
    const newDriver = await this.#model.create({mobile,password: hashedPassword,fullName,nationalCode,driverCode})
    if(!newDriver) throw createHttpError.InternalServerError();
    const wallet = await this.#walletmodel.create({userId: newDriver._id});
    token = this.signToken({ mobile, userId: newDriver._id });
    return token;
  }
  async signToken(payload) {
    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);
    return { accessToken, refreshToken };
  }
  signAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
  }
  signRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESHSECRET_KEY, {
      expiresIn: "1d",
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
              createHttpError.Unauthorized(DriverMessage.TokenIsInvalid)
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
            throw new createHttpError.Unauthorized(DriverMessage.NotFound);
          resolve({ mobile, userId });
        }
      );
    });
  }

  async createHashPassword(password){
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword
}
async compareHashPassword(password,userPassword){
    const passwordMatch = await bcrypt.compare(password, userPassword);
    return passwordMatch
}
}

module.exports = new DriverAuthService();
