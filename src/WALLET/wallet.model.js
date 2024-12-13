const { Schema, model, Types } = require("mongoose");

const PriceDetailSchema = new Schema({
    title: {type: String,required: true},
    price: {type: Number,required: true},
    nop: {type: Number,required: true},
},{
    versionKey: false,
    timestamps: false
})

const DetailSchema = new Schema({
    RefNo: {type: Number,required: true,unique: true},
    amount: {type: Number,required: true},
    commission: {type: Number,required: true,default: 0},
    paymentId: {type: Types.ObjectId, ref: "payment",required: false},
    state: {type: String,enum: ['INCREMENT','DECREMENT','PAYMENT'],required: true},
    description: {type: String,required: true},
    status: {type: Boolean,required: true},
    priceDetail: {type: PriceDetailSchema,required: false},
},{
    versionKey: false,
    timestamps: true
})

const WalletSchema = new Schema({
    userId: {type: Types.ObjectId,ref: "user" || "driver",required: true, unique: true},
    balance: {type: Number,required: true,default: 0},
    IBAN: {type: String,required: false},
    IBANName: {type: String,required: false},
    IBANBank: {type: String,required: false},
    cardNum: {type: String,required: false},
    detail: {type: [DetailSchema],required: false},
},{
    versionKey: false,
    timestamps: true
})

const walletModel = model('wallet',WalletSchema);
module.exports = {
    walletModel
}