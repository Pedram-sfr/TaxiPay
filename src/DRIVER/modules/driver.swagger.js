//--------------------- Driver Secion ---------------------//

/**
 * @swagger
 *  tags:
 *      -   name: Driver
 *      -   name: Driver-Auth
 *          description: Driver-Auth Routes
 *      -   name: Driver-Profile
 *          description: Driver-Profile Routes
 *      -   name: Driver-Wallet
 *          description: Driver-Wallet Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          login:
 *              type: object
 *              required:
 *                  -   mobile
 *                  -   password
 *              properties:
 *                  mobile:
 *                      type: string
 *                  password:
 *                      type: string
 *          register:
 *              type: object
 *              required:
 *                  -   mobile
 *                  -   password
 *                  -   nationalCode
 *                  -   fullName
 *              properties:
 *                  mobile:
 *                      type: string
 *                  password:
 *                      type: string
 *                  nationalCode:
 *                      type: string
 *                  fullName:
 *                      type: string
 *          DriverProfileEdit:
 *              type: object
 *              properties:
 *                  image:
 *                      type: file
 *                  car:
 *                      type: string
 *                  pellak:
 *                      type: string
 *          priceDetail:
 *              type: object
 *              required:
 *                  -   title
 *                  -   amount
 *              properties:
 *                  title:
 *                      type: string
 *                  amount:
 *                      type: number
 *          priceDetailRemove:
 *              type: object
 *              required:
 *                  -   priceDetailId
 *              properties:
 *                  priceDetailId:
 *                      type: string
 */

/**
 * @swagger
 *  /driver/auth/login:
 *  post:
 *      summary: Login in DriverPanel
 *      tags:
 *          -   Driver-Auth
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/login"
 *      responses:
 *          200:
 *              description: success
 */
/**
 * @swagger
 *  /driver/auth/register:
 *  post:
 *      summary: register driver
 *      tags:
 *          -   Driver-Auth
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/register"
 *      responses:
 *          200:
 *              description: success
 */

/**
 * @swagger
 * /driver/auth/refresh-token:
 *  post:
 *      summary: sign refreshToken
 *      tags:
 *          -   Driver-Auth
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
 * /driver/auth/logout:
 *  get:
 *      summary: logout user from account
 *      tags:
 *          -   Driver-Auth
 *      responses:
 *          200:
 *              description: success
 *      
 */


////////////////driver


/**
 * @swagger
 * /driver/{driverCode}:
 *  get:
 *      summary: get driver
 *      tags:
 *          -   Driver-Profile
 *      parameters:
 *          -   in: path
 *              name: driverCode
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /driver/profile:
 *  get:
 *      summary: get profile
 *      tags:
 *          -   Driver-Profile
 *      responses:
 *          200:
 *              description: success
 *      
 */

/**
 * @swagger
 * /driver/profile/edit:
 *  post:
 *      summary: edit profile
 *      tags:
 *          -   Driver-Profile
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      $ref: "#/components/schemas/DriverProfileEdit"
 *      responses:
 *          200:
 *              description: success
 *      
 */

/**
 * @swagger
 * /driver/profile/priceDetail:
 *  get:
 *      summary: get priceDetail List
 *      tags:
 *          -   Driver-Profile
 *      responses:
 *          200:
 *              description: success
 *      
 */

/**
 * @swagger
 * /driver/profile/priceDetail:
 *  post:
 *      summary: update priceDetail
 *      tags:
 *          -   Driver-Profile
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/priceDetail"
 *      responses:
 *          200:
 *              description: success
 *      
 */

/**
 * @swagger
 * /driver/profile/priceDetail/remove:
 *  post:
 *      summary: update priceDetail
 *      tags:
 *          -   Driver-Profile
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/priceDetailRemove"
 *      responses:
 *          200:
 *              description: success
 *      
 */

//////////////////////////////wallet

/**
 * @swagger
 * /driver/profile/wallet:
 *  get:
 *      summary: get wallet
 *      tags:
 *          -   Driver-Wallet
 *      responses:
 *          200:
 *              description: success
 *      
 */

/**
 * @swagger
 * /driver/profile/wallet/card_to_iban:
 *  post:
 *      summary: card_to_iban
 *      tags:
 *          -   Driver-Wallet
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
 * /driver/profile/wallet/edit_iban:
 *  post:
 *      summary: card_to_iban
 *      tags:
 *          -   Driver-Wallet
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