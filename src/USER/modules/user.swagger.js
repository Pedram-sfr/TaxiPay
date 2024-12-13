//--------------------- User Secion ---------------------//


/**
 * @swagger
 *  tags:
 *      -   name: User
 *      -   name: User-Auth
 *          description: User-Auth Routes
 *      -   name: User-Profile
 *          description: User Routes
 *      -   name: User-Wallet
 *          description: User-Wallet Routes
 */



/**
 * @swagger
 *  components:
 *      schemas:
 *          SendOTP:
 *              type: object
 *              required:
 *                  -   mobile
 *              properties:
 *                  mobile:
 *                      type: string
 *          CheckOTP:
 *              type: object
 *              required:
 *                  -   mobile
 *                  -   code
 *              properties:
 *                  mobile:
 *                      type: string
 *                  code:
 *                      type: string
 *          RefreshToken:
 *              type: object
 *              required:
 *                  -   refreshToken
 *              properties:
 *                  refreshToken:
 *                      type: string
 *          ProfileEdit:
 *              type: object
 *              required:
 *                  -   fullName
 *              properties:
 *                  fullName:
 *                      type: string
 *          CardToIban:
 *              type: object
 *              required:
 *                  -   card_number
 *              properties:
 *                  card_number:
 *                      type: string
 *          EditIBAN:
 *              type: object
 *              required:
 *                  -   name
 *                  -   IBAN
 *                  -   bankName
 *                  -   cardNumber
 *              properties:
 *                  name:
 *                      type: string
 *                  IBAN:
 *                      type: string
 *                  bankName:
 *                      type: string
 *                  cardNumber:
 *                      type: string
 */

/**
 * @swagger
 *  /user/auth/send-otp:
 *  post:
 *      summary: Login with otp Code
 *      tags:
 *          -   User-Auth
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/SendOTP"
 *      responses:
 *          200:
 *              description: success
 */
/**
 * @swagger
 *  /user/auth/check-otp:
 *  post:
 *      summary: check otp Code
 *      tags:
 *          -   User-Auth
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/CheckOTP"
 *      responses:
 *          200:
 *              description: success
 */

/**
 * @swagger
 * /user/auth/refresh-token:
 *  post:
 *      summary: sign refreshToken
 *      tags:
 *          -   User-Auth
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/RefreshToken"
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /user/auth/logout:
 *  get:
 *      summary: logout user from account
 *      tags:
 *          -   User-Auth
 *      responses:
 *          200:
 *              description: success
 *      
 */


////////////////User


/**
 * @swagger
 * /user/profile:
 *  get:
 *      summary: get profile
 *      tags:
 *          -   User-Profile
 *      responses:
 *          200:
 *              description: success
 *      
 */

/**
 * @swagger
 * /user/profile/edit:
 *  post:
 *      summary: edit profile
 *      tags:
 *          -   User-Profile
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/ProfileEdit"
 *      responses:
 *          200:
 *              description: success
 *      
 */

/**
 * @swagger
 * /user/profile/wallet:
 *  get:
 *      summary: get wallet
 *      tags:
 *          -   User-Wallet
 *      responses:
 *          200:
 *              description: success
 *      
 */

/**
 * @swagger
 * /user/profile/wallet/card_to_iban:
 *  post:
 *      summary: card_to_iban
 *      tags:
 *          -   User-Wallet
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/CardToIban"
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /user/profile/wallet/edit_iban:
 *  post:
 *      summary: card_to_iban
 *      tags:
 *          -   User-Wallet
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/EditIBAN"
 *      responses:
 *          200:
 *              description: success
 *      
 */
