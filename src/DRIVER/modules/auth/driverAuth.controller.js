const autoBind = require("auto-bind");
const { DriverMessage } = require("../driver.message");
const redisClient = require("../../../config/initRedis");
const driverAuthService = require("./driverAuth.service");


class DriverAuthController{
    #service
    constructor(){
        autoBind(this)
        this.#service = driverAuthService
    }

    async login(req,res,next){
        try {
            const {mobile,password}=req.body;
            const token = await this.#service.login(mobile,password);
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: "login successfully",
                    token
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }

    async register(req,res,next){
        try {
            const {mobile,password,fullName,nationalCode}=req.body;
            const token = await this.#service.registerDriver(mobile,password,fullName,nationalCode);
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: "register success",
                    token
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }

    async refreshToken(req,res,next){
        try {
            const {refreshToken} = req.body;
            const {mobile,userId} = await this.#service.verifyRefreshToken(refreshToken);
            const token = await this.#service.signToken({mobile,userId});
            return res.status(200).json({
                statusCode: 200,
                data: {
                    token
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }

    async logout(req,res,next){
        try {
            const {userId,token} = req.user;
            await redisClient.set(String(userId), token, { EX: (24*60*60) }, (err) => {
                if (err) return err.message;
            });
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: UserMessage.Logout,
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new DriverAuthController()