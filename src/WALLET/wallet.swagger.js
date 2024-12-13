//--------------------- Wallet Secion ---------------------//


/**
 * @swagger
 *  tags:
 *      -   name: Wallet
 *      -   name: Wallet-Transactions
 *          description: Wallet-Transactions Routes
 */



/**
 * @swagger
 *  components:
 *      schemas:
 *          ChargeWallet:
 *              type: object
 *              required:
 *                  -   amount
 *                  -   chargeType
 *                  -   callbackUrl
 *              properties:
 *                  amount:
 *                      type: number
 *                  chargeType:
 *                      type: number
 *                  callbackUrl:
 *                      type: string
 *                  redirectUrl:
 *                      type: string
 *          PayBill:
 *              type: object
 *              required:
 *                  -   driverCode
 *                  -   lineId
 *                  -   nop
 *              properties:
 *                  driverCode:
 *                      type: number
 *                  lineId:
 *                      type: string
 *                  nop:
 *                      type: number
 */


/**
 * @swagger
 * /transactions/charge-wallet:
 *  post:
 *      summary: charge-wallet
 *      tags:
 *          -   Wallet-Transactions
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/ChargeWallet"
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /transactions/redirect-url:
 *  get:
 *      summary: charge-wallet get redirectUrl
 *      tags:
 *          -   Wallet-Transactions
 *      responses:
 *          200:
 *              description: success
 *          404:
 *              description: notfound
 *      
 */
/**
 * @swagger
 * /transactions/paybill:
 *  post:
 *      summary: pay bill
 *      tags:
 *          -   Wallet-Transactions
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/PayBill"
 *      responses:
 *          200:
 *              description: success
 *      
 */
