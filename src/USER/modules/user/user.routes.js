const Authorization = require('../../../common/guard/authorization.guard');
const walletController = require('../../../WALLET/wallet.controller');
const userController = require('./user.controller');

const router = require('express').Router();

//---Profile
router.get("/profile",Authorization,userController.profile);
router.post("/profile/edit",Authorization,userController.editProfile);
//----Wallet
router.get("/profile/wallet",Authorization,walletController.userWallet);
router.post("/profile/wallet/card_to_iban",Authorization,walletController.cardToSheba);
router.post("/profile/wallet/edit_iban",Authorization,walletController.editUserWallet);

module.exports = {
    UserProfileRouter: router
}