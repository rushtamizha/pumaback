import mongoose from "mongoose";
const referralSchema = new mongoose.Schema({
    referrerUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // upline
    referredUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // downline
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Referral", referralSchema);
