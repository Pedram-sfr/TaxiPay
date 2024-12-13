const createHttpError = require("http-errors")
const jwt = require("jsonwebtoken");
const { UserMessage } = require("../../USER/modules/user.message");
const userModel = require("../../USER/modules/user/user.model");
require("dotenv").config();
const RefreshTokenAuth = async (req,res,next)=>{
    try {
        const headers = req.headers;
        const [bearer, token] = headers?.["authorization"]?.split(" ") || [];
        if(token && ["bearer","Bearer"].includes(bearer)){
            jwt.verify(token,process.env.JWT_REFRESHSECRET_KEY,async (err,payload)=>{
                if(err) return next(createHttpError.Unauthorized(UserMessage.TokenIsInvalid))
                const {mobile,userId} = payload;
                const user = await userModel.findOne({mobile}, {accessToken: 0, otp: 0, updatedAt: 0,createdAt: 0, verfiedMobile: 0,_id: 0}).lean();
                if(!user) throw new createHttpError.Unauthorized(UserMessage.NotFound);
                req.user ={userId,token};
                return next();
            })
        }
        else return next(createHttpError.Unauthorized(UserMessage.TokenIsInvalid));
    } catch (error) {
        next(error)
    }
}

module.exports = RefreshTokenAuth