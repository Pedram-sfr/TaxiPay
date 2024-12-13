const Authorization = require('../common/guard/authorization.guard');
const walletController = require('./wallet.controller');

const router = require('express').Router();

router.post("/charge-wallet",Authorization,walletController.chargeWallet);
router.get("/gateway/verify",walletController.gatewayVerify);
router.get("/redirect-url",Authorization,walletController.redirectUrl);
router.post("/paybill",Authorization,walletController.payBill);

module.exports = {
    WalletRouter: router
}