import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    mobile: { type: Number, unique: true },
    password: String,
    referralCode: { type: String, unique: true },
    referredBy: { type: String },
    otp: String,
    vipPurchases: {
        mobile: { type: Number, default: 0 }, // VIP level purchased for mobiles
        toy: { type: Number, default: 0 },
        shirt: { type: Number, default: 0 }
    },
    vipItemsPurchased: {
        toy: {
            1: { type: Boolean, default: false },
            2: { type: Boolean, default: false },
            3: { type: Boolean, default: false },
            4: { type: Boolean, default: false },
            5: { type: Boolean, default: false },
        },
        shirt: {
            1: { type: Boolean, default: false },
            2: { type: Boolean, default: false },
            3: { type: Boolean, default: false },
            4: { type: Boolean, default: false },
            5: { type: Boolean, default: false }
        }
    },
    wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
    bankDetails: {
        bankName: String,
        accountNumber: String,
        ifsc: String
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
