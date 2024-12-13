const { Schema, model, Types } = require("mongoose");

const PaymentSchema = new Schema(
  {
    trackId: {type: Number,required: true,unique: true},
    userId: { type: Types.ObjectId,ref: "user", required: true },
    wdId: { type: Types.ObjectId,ref: "wallet", required: false },
    amount: { type: Number, required: true },
    paidAt: { type: Date, required: false },
    cardNumber: { type: String, required: false },
    refNumber: { type: Number, required: false },
    description: { type: String, required: false },
    statusCode: { type: Number, required: false },
    result: { type: Number, required: false },
    status: { type: Boolean, required: true, default: false },
  },
  { timestamps: true, versionKey: 0 }
);

const PaymentModel = model("payment", PaymentSchema);
module.exports = PaymentModel;