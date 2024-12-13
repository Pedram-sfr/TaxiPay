const { Schema, model } = require("mongoose");

const PriceDetailSchema = new Schema({
    title: { type: String,required: true},
    amount: {type: Number,required: true},
},{
    versionKey: false,
    timestamps: false
})

const driverSchema = new Schema({
    driverCode: {type: Number,unique: true,required: true},
    mobile: {type: String,unique: true,required: true},
    nationalCode: { type: String, required: true, unique: true },
    password: {type: String,required: true},
    fullName: {type: String, required: false},
    image: {type: String, required: false},
    car: {type: String, required: false},
    pellak: {type: String, required: false},
    role: { type: String, default: "DRIVER", required: true },
    priceDetail: {type: [PriceDetailSchema],required: false},
},{timestamps: true, versionKey: false})

const driverModel = model("driver",driverSchema);
module.exports = driverModel