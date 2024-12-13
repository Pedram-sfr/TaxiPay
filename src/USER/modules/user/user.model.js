const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
    mobile: {type: String,unique: true,required: true},
    fullName: {type: String},
    role: { type: String, default: "USER" },
},{timestamps: true, versionKey: false});

const userModel = model("user",userSchema);
module.exports = userModel;