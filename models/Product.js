import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    category: { type: String, enum: ['mobile', 'toy', 'shirt'], required: true },
    name: { type: String, required: true },
    image: String,
    description: String,
    vipLevel: { type: Number, enum: [1, 2, 3], required: true },
    dayIncome:{type: Number,required:true},
    monthIncome:{type: Number,required:true},
    price: { type: Number, required: true },
    cashback: { type: Number, required: true },
    quantity: { type: Number, default: 0 }, // Only applicable for Mobiles
    createdAt: { type: Date, default: Date.now },
    expectedDate: { type: Number, required:true }
});

export default mongoose.model("Product", productSchema);
