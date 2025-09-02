import Referral from '../models/Referral.js';
import Wallet from '../models/Wallet.js';
import Commission from '../models/Commission.js';

export const distributeCommission = async (buyer, amount) => {
  // 1️⃣ Find referrer from referral table
  const referral = await Referral.findOne({ referredUser: buyer._id });
  if (!referral || !referral.referrerUser) return;

  const referrerId = referral.referrerUser;

  // 2️⃣ Add commission to referrer wallet
  const wallet = await Wallet.findOne({ user: referrerId });
  const commissionAmount = (amount * 3) / 100;

  wallet.balance += commissionAmount;
  wallet.commission += commissionAmount;
  await wallet.save();

  // 3️⃣ Log commission entry
  await Commission.create({
    user: referrerId,
    fromUser: buyer._id,
    amount: commissionAmount,
    level: 1
  });
};
