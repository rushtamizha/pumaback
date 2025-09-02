import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Deposit from '../models/Deposit.js';
import Withdrawal from '../models/Withdrawal.js';
import Reward from '../models/Reward.js';
import Referral from '../models/Referral.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const getProfile = async (req, res) => {
    const user = await User.findById(req.user._id)
    .populate('wallet');
    res.json(user);
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('product');
    res.json(orders)
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};
export const getBank = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.bankDetails) {
            return res.status(404).json({ message: "Bank details not found" });
        }
        res.json(user.bankDetails);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const addBank = async (req, res) => {
    const { bankName, accountNumber, ifsc } = req.body;
    await User.findByIdAndUpdate(req.user._id, { bankDetails: { bankName, accountNumber, ifsc } });
    res.json({ message: "Bank details added" });
};

export const deposit = async (req, res) => {
    let { amount } = req.body;

    // Ensure amount is numeric
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "Invalid deposit amount" });
    }

    const wallet = await Wallet.findOne({ user: req.user._id });

    wallet.balance += amount;
    await wallet.save();

    const deposit = new Deposit({ user: req.user._id, amount });
    await deposit.save();

    res.json({ message: "Deposit successful" });
};


export const withdraw = async (req, res) => {
    let { amount } = req.body;

    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "Invalid withdrawal amount" });
    }

    const wallet = await Wallet.findOne({ user: req.user._id });

    if (wallet.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
    }

    wallet.balance -= amount;
    await wallet.save();

    const withdrawal = new Withdrawal({ user: req.user._id, amount });
    await withdrawal.save();

    res.json({ message: "Withdrawal request submitted" });
};


export const dailyCheckin = async (req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    const rewardExist = await Reward.findOne({ user: req.user._id, type: 'Daily Checkin', createdAt: { $gte: new Date(today) } });

    if (rewardExist) return res.status(400).json({ message: "Already checked in today" });

    const wallet = await Wallet.findOne({ user: req.user._id });
    wallet.balance += 1;
    wallet.rewards += 1;
    await wallet.save();

    const reward = new Reward({ user: req.user._id, type: 'Daily Checkin', amount: 1 });
    await reward.save();

    res.json({ message: "Check-in successful" });
};



