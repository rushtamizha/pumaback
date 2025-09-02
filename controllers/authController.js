import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Referral from '../models/Referral.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const  generateOTP = ()=> {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function generateReferralCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ✅ Updated Generate OTP API:
export const generateOtp = async (req, res) => {
    const { mobile } = req.body;

    let user = await User.findOne({ mobile });

    // ✅ If user already fully registered, block OTP generation
    if (user && user._id) {
        return res.status(400).json({ message: "Mobile number already registered" });
    }

    const otp = generateOTP();

    if (!user) {
        user = new User({ mobile, otp,referralCode: generateReferralCode()});
    } else {
        user.otp = otp;
    }
    await user.save();

    res.json({ message: "OTP sent successfully", otp }); // In production: send via SMS
};

// ✅ Registration Logic
export const register = async (req, res) => {
  try {
    const { name, mobile, password, otp, referredBy } = req.body;

    // 1️⃣ Find existing or partial user
    let user = await User.findOne({ mobile });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP or mobile" });
    }

    // 2️⃣ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Generate referral code
    const referralCode = generateReferralCode();

    // 4️⃣ Update user record
    user.name = name;
    user.password = hashedPassword;
    user.referralCode = referralCode;
    user.referredBy = referredBy;
    user.otp = null;
    user.vipPurchases = { mobile: 0, toy: 0, shirt: 0 };

    await user.save();

    // 5️⃣ Create wallet if not exists
    let wallet = await Wallet.findOne({ user: user._id });
    if (!wallet) {
      wallet = new Wallet({ user: user._id });
      await wallet.save();
      user.wallet = wallet._id;
      await user.save();
    }

    // 6️⃣ Handle direct referral (if valid)
    if (referredBy) {
      const refUser = await User.findOne({ referralCode: referredBy });
      if (!refUser) {
        console.log("⚠️ Invalid referral code:", referredBy);
      }
    }

  const existingUser = await User.findOne({mobile});
  const referredUser = existingUser; // The one just registered

// Find the referrer by referralCode
if (referredBy) {
  const referrer = await User.findOne({ referralCode: referredBy });

  if (!referrer) {
    console.log("⚠️ Referrer not found for code:", referredBy);
  } else {
    // Create the referral relationship
    const referModule = new Referral({
      referrerUser: referrer._id,   // should be ObjectId
      referredUser: referredUser._id, // should be ObjectId
    });

    await referModule.save();
  }
}

    // 7️⃣ Return success response
    res.json({ message: "Registration successful" });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: err.message });
  }
};
// ✅ Login Logic
export const login = async (req, res) => {
    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile }).lean();
    if (!user) return res.status(400).json({ message: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
};

export const resetPassword = async (req, res) => {
    const { mobile, otp, newPassword } = req.body;

    const user = await User.findOne({ mobile });

    if (!user || user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    await user.save();

    res.json({ message: "Password reset successful" });
};
export const generateForgotOtp = async (req, res) => {
    const { mobile } = req.body;
       if (!mobile) return res.status(400).json({ message: "Mobile is required" });
         const trimmedMobile = mobile.trim();
         let user = await User.findOne({ mobile: trimmedMobile });


    if (!user ) {
        return res.status(400).json({ message: "Mobile number not registered" });
    }

    const otp = generateOTP();
    user.otp = otp;
    await user.save();

    res.json({ message: "OTP sent successfully", otp });  // ⚠️ In production: send via SMS
};
