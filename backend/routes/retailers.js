const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const { retailerAuth } = require('../middleware/auth');

const router = express.Router();

// Get retailer dashboard stats
router.get('/dashboard', retailerAuth, async (req, res) => {
  try {
    const retailerId = req.user._id;

    // Get total products
    const totalProducts = await Product.countDocuments({ retailer: retailerId });

    // Get active products
    const activeProducts = await Product.countDocuments({ 
      retailer: retailerId, 
      isActive: true 
    });

    // Get low stock products (quantity < 10)
    const lowStockProducts = await Product.countDocuments({ 
      retailer: retailerId, 
      quantity: { $lt: 10 },
      isActive: true
    });

    // Get out of stock products
    const outOfStockProducts = await Product.countDocuments({ 
      retailer: retailerId, 
      quantity: 0,
      isActive: true
    });

    // Get total inventory value
    const products = await Product.find({ retailer: retailerId, isActive: true });
    const totalInventoryValue = products.reduce((sum, product) => {
      return sum + (product.price * product.quantity);
    }, 0);

    // Get products by category
    const categoryStats = await Product.aggregate([
      { $match: { retailer: retailerId, isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 }, totalValue: { $sum: { $multiply: ['$price', '$quantity'] } } } },
      { $sort: { count: -1 } }
    ]);

    // Get recent products
    const recentProducts = await Product.find({ retailer: retailerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name price quantity category createdAt');

    res.json({
      stats: {
        totalProducts,
        activeProducts,
        lowStockProducts,
        outOfStockProducts,
        totalInventoryValue: Math.round(totalInventoryValue * 100) / 100
      },
      categoryStats,
      recentProducts
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard stats' });
  }
});

// Get retailer profile
router.get('/profile', retailerAuth, async (req, res) => {
  try {
    const retailer = await User.findById(req.user._id).select('-password');
    res.json(retailer);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// Update retailer profile
router.put('/profile', retailerAuth, async (req, res) => {
  try {
    const allowedUpdates = ['name', 'phone', 'address'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const retailer = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      retailer
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// Get retailer's product performance
router.get('/analytics/products', retailerAuth, async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const products = await Product.find({ 
      retailer: req.user._id,
      createdAt: { $gte: startDate }
    }).select('name price quantity category createdAt');

    // Group by category
    const categoryPerformance = await Product.aggregate([
      { $match: { retailer: req.user._id, createdAt: { $gte: startDate } } },
      { $group: { 
        _id: '$category', 
        count: { $sum: 1 }, 
        totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
        avgPrice: { $avg: '$price' }
      }},
      { $sort: { count: -1 } }
    ]);

    res.json({
      products,
      categoryPerformance,
      period: parseInt(period)
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error while fetching analytics' });
  }
});

// Get top performing products
router.get('/analytics/top-products', retailerAuth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topProducts = await Product.find({ retailer: req.user._id, isActive: true })
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .limit(parseInt(limit))
      .select('name price quantity category rating');

    res.json(topProducts);
  } catch (error) {
    console.error('Top products error:', error);
    res.status(500).json({ message: 'Server error while fetching top products' });
  }
});

module.exports = router; 