const autoBind = require("auto-bind");
const authService = require("./auth.service");
const { sendOTPSchema, checkOTPSchema } = require("../../validator/auth.schema")
const { UserMessage } = require("../user.message");
const redisClient = require("../../../config/initRedis");


class AuthController{
    #service
    constructor(){
        autoBind(this)
        this.#service = authService
    }

    async sendOtp(req,res,next){
        try {
            await sendOTPSchema.validateAsync(req.body);
            const {mobile}=req.body;
            const code = await this.#service.sendOtp(mobile);
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: UserMessage.SendOTPSuccessfully,
                    code
                },
                error: null
            })
        } catch (error) {
            next(error)
        }
    }

    async checkOtp(req,res,next){
        try {
            await checkOTPSchema.validateAsync(req.body);
            const {mobile,code}=req.body;
            const token = await this.#service.checkOtp(mobile,code);
            return res.status(200).json({
                statusCode: 200,
                data: {
                    message: UserMessage.LoginSuccessfully,
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

module.exports = new AuthController()