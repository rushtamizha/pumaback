import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Product from "../models/Product.js";
import Withdrawal from '../models/Withdrawal.js';
// controllers/adminController.js
import GiveawayCode from '../models/Giveaway.js';
// Admin Register
export const adminRegister = async (req, res) => {
    const { username, password } = req.body;
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    res.json({ message: "Admin registered successfully" });
};

// Admin Login (already exist)
export const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const validPass = await bcrypt.compare(password, admin.password);
    if (!validPass) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    res.json({ token });
};


export const addProduct = async (req, res) => {
  try {

    console.log("Incoming Product Data:", req.body);

    const { category, product, img, name, price,vipLevel,monthIncome,dayIncome,expectedDate, description, cashback, quantity } = req.body;

    const newProduct = new Product({
      category,
      product,
      img,
      price,
      name,
      monthIncome,
      expectedDate,
      dayIncome,
      vipLevel,
      description,
      cashback,
      quantity: category === 'mobiles' ? quantity : undefined
    });

    await newProduct.save();

    res.json({ message: "Product added successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔍 Get all users with wallet info
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('wallet');
    res.json(users);
  } catch (err) {
    console.error('Fetch users failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✏️ Update user info
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, vipPurchases, wallet } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update user fields
    user.name = name || user.name;
    user.mobile = mobile || user.mobile;
    user.vipPurchases = {
      mobile: vipPurchases?.mobile ?? user.vipPurchases.mobile,
      toy: vipPurchases?.toy ?? user.vipPurchases.toy,
      shirt: vipPurchases?.shirt ?? user.vipPurchases.shirt,
    };
    await user.save();

    // Update wallet balance
    if (wallet?.balance !== undefined && user.wallet) {
      const walletDoc = await Wallet.findById(user.wallet);
      if (walletDoc) {
        walletDoc.balance = wallet.balance;
        await walletDoc.save();
      }
    }

    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Update failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔍 Get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('wallet')
      .populate('referredBy')
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✏️ Update user details
export const updateUserDetails = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// ✅ Update Withdrawal Status
export const updateWithdrawalStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ message: "Withdrawal not found" });

    withdrawal.status = status;
    await withdrawal.save();

    res.json({ message: "Withdrawal status updated", withdrawal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update withdrawal" });
  }
};
export const getWithdrawals = async (req, res) => {
  const withdrawals = await Withdrawal.find()
    .populate('user')
    .sort({ createdAt: -1 });

  // Optional: populate other models like Order, etc.

  res.json(withdrawals);
};


export const createTaskCode = async (req, res) => {
  const { code, amount } = req.body;

  const existing = await GiveawayCode.findOne({ code });
  if (existing) return res.status(400).json({ message: "Code already exists" });

  const newCode = new GiveawayCode({ code, amount });
  await newCode.save();

  res.json({ message: "Giveaway code created" });
};
