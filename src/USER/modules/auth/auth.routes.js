const RefreshTokenAuth = require("../../../common/guard/refreshToken.guard");
const authController = require("./auth.controller");

const router = require("express").Router();

router.post("/send-otp",authController.sendOtp);
router.post("/check-otp",authController.checkOtp);
router.post("/refresh-token",authController.refreshToken);
router.get("/logout",RefreshTokenAuth ,authController.logout);


module.exports = {
    UserAuthRouter: router
}