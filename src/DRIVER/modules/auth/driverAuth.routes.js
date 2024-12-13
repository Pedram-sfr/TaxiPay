const RefreshTokenAuth = require("../../../common/guard/refreshToken.guard");
const DriverAuthController = require("./driverAuth.controller");

const router = require("express").Router();

router.post("/register",DriverAuthController.register);
router.post("/login",DriverAuthController.login);
router.post("/refresh-token",DriverAuthController.refreshToken);
router.get("/logout",RefreshTokenAuth ,DriverAuthController.logout);


module.exports = {
    DriverAuthRouter: router
}