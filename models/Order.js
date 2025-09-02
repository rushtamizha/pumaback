import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    amount: Number,
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    cashbackStatus: { type: String, enum: ['Hold', 'Released'], default: 'Hold' },
    createdAt: { type: Date, default: Date.now },
    expectedDate:{type:Number},
    expectedCashbackDate: { type: Date }
});

export default mongoose.model("Order", orderSchema);
