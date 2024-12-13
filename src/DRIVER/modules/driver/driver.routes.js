const Authorization = require('../../../common/guard/authorization.guard');
const { uploadimage } = require('../../../common/utils/multer');
const walletController = require('../../../WALLET/wallet.controller');
const driverController = require('./driver.controller');

const router = require('express').Router();

//---Profile
router.get("/profile",Authorization,driverController.profile);
router.get("/:driverCode",Authorization,driverController.getDriver);
router.post("/profile/edit",Authorization,uploadimage.single('image'),driverController.editProfile);
router.get("/profile/priceDetail",Authorization,driverController.priceDetailList);
router.post("/profile/priceDetail",Authorization,driverController.updatePriceDetail);
router.post("/profile/priceDetail/remove",Authorization,driverController.removePriceDetail);
//----Wallet
router.get("/profile/wallet",Authorization,walletController.userWallet);
router.post("/profile/wallet/card_to_iban",Authorization,walletController.cardToSheba);
router.post("/profile/wallet/edit_iban",Authorization,walletController.editUserWallet);

module.exports = {
    DriverProfileRouter: router
}