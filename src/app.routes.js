const { Router } = require("express");
const { UserAuthRouter } = require("./USER/modules/auth/auth.routes");
const { UserProfileRouter } = require("./USER/modules/user/user.routes");
const { DriverAuthRouter } = require("./DRIVER/modules/auth/driverAuth.routes");
const { DriverProfileRouter } = require("./DRIVER/modules/driver/driver.routes");
const { WalletRouter } = require("./WALLET/wallet.routes");

const AllRouter = Router();

AllRouter.use("/user/auth",UserAuthRouter)
AllRouter.use("/user",UserProfileRouter)
AllRouter.use("/driver/auth",DriverAuthRouter)
AllRouter.use("/driver",DriverProfileRouter)
AllRouter.use("/transactions",WalletRouter)

module.exports = AllRouter;