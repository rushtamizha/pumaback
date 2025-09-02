import Product from '../models/Product.js';
import Wallet from '../models/Wallet.js';
import Order from '../models/Order.js';
import Referral from '../models/Referral.js';
import User from '../models/User.js';
import Commission from '../models/Commission.js'; 


// Helper function: Initialize vipPurchases safely
function initializeVipPurchases(user) {
    if (!user.vipPurchases) {
        user.vipPurchases = { mobile: 0, toy: 0, shirt: 0 };
    } else {
        user.vipPurchases.mobile = user.vipPurchases.mobile || 0;
        user.vipPurchases.toy = user.vipPurchases.toy || 0;
        user.vipPurchases.shirt = user.vipPurchases.shirt || 0;
    }
}

export const listProducts = async (req, res) => {
    const products = await Product.find();
    res.json(products);
};

export const addProduct = async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.json({ message: "Product added successfully" });
};

export const buyProduct = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const user = await User.findById(userId);
    initializeVipPurchases(user);
    const wallet = await Wallet.findOne({ user: userId });


     // ✅ Check if user has enough balance
    if (wallet.balance < product.price) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

     // ⛑️ Safe init
    if (!user.vipPurchases) user.vipPurchases = { mobile: 0, toy: 0, shirt: 0 };
    if (!user.vipItemsPurchased) {
        user.vipItemsPurchased = {
            toy: { 1: false, 2: false, 3: false,4:false,5:false },
            shirt: { 1: false, 2: false, 3: false,4:false,5:false }
        };
    }

     // 📱 Mobile purchases - unlimited
    if (product.category === 'mobile') {
        if (product.quantity <= 0) return res.status(400).json({ message: 'Out of stock' });

        // Upgrade mobile VIP level
        user.vipPurchases.mobile = Math.max(user.vipPurchases.mobile, product.vipLevel);
        product.quantity -= 1;
    } else {
        // 🎯 Check if user has that VIP level unlocked via mobile
        if (user.vipPurchases.mobile < product.vipLevel) {
            return res.status(400).json({ message: `Buy VIP ${product.vipLevel} Mobile first` });
        }

        // 🛑 Prevent multiple purchases of same VIP shirt/toy
        if (product.category === 'toy') {
            if (user.vipItemsPurchased.toy[product.vipLevel]) {
                return res.status(400).json({ message: `You already bought VIP ${product.vipLevel} Toy` });
            }
            user.vipItemsPurchased.toy[product.vipLevel] = true;
        }

        if (product.category === 'shirt') {
            if (user.vipItemsPurchased.shirt[product.vipLevel]) {
                return res.status(400).json({ message: `You already bought VIP ${product.vipLevel} Shirt` });
            }
            user.vipItemsPurchased.shirt[product.vipLevel] = true;
        }
    }

    // ✅ Deduct money
    wallet.balance -= product.price;

    // ✅ Save all changes
    await wallet.save();
    await user.save();
    await product.save();

    const val = product.expectedDate

    const order = new Order({
        user: userId,
        product: productId,
        amount: product.price,
       expectedCashbackDate: new Date(Date.now() + val * 24 * 60 * 60 * 1000)
    });
    await order.save();

    // ✅ Commission on purchase
  const referral = await Referral.findOne({ referredUser: userId });
  if (referral && referral.referrerUser) {
    const referrerWallet = await Wallet.findOne({ user: referral.referrerUser });

    let commissionPercent = 0;
    if (product.category === 'mobile') commissionPercent = 30;
    if (product.category === 'toy' || product.category === 'shirt') commissionPercent = 2;

    const commissionAmount = (product.price * commissionPercent) / 100;

    referrerWallet.balance += commissionAmount;
    referrerWallet.commission += commissionAmount;
    await referrerWallet.save();
  }

    res.json({ message: 'Product purchased successfully', order });
};
export const completeOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId).populate('product user');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.status === 'Completed') return res.status(400).json({ message: 'Order already completed' });

        // ✅ 1. Mark order as completed
        order.status = 'Completed';
        order.cashbackStatus = 'Released';
        await order.save();

        // ✅ 2. Cashback to buyer
        const buyerWallet = await Wallet.findOne({ user: order.user._id });
        buyerWallet.balance += order.product.cashback;
        await buyerWallet.save();

        /* / ✅ 3. Direct Referral Commission (3%)
         // 4. Direct referral commission
    const referral = await Referral.findOne({ referredUser: order.user._id });
    if (referral && referral.referrerUser) {
      const referrerWallet = await Wallet.findOne({ user: referral.referrerUser });

      if (referrerWallet) {
        const commissionAmount = (order.product.price * 3) / 100;
        referrerWallet.balance += commissionAmount;
        referrerWallet.commission = (referrerWallet.commission || 0) + commissionAmount;
        await referrerWallet.save();
        console.log(`✅ Commission of ₹${commissionAmount} credited to referrer`);
      } else {
        console.warn("⚠️ Referrer's wallet not found");
      }
    } else {
      console.warn("⚠️ No referral record found");
    } */

        return res.json({ message: 'Order completed: cashback and direct referral commission released.' });

    } catch (err) {
        console.error("❌ Error in completeOrder:", err);
        res.status(500).json({ message: 'Server error' });
    }
};
