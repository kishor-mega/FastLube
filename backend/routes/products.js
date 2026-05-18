const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { auth, retailerAuth } = require('../middleware/auth');

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      brand, 
      search, 
      minPrice, 
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isActive: true };
    
    // Apply filters
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query)
      .populate('retailer', 'name')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// Static paths must be registered before /:id
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});

router.get('/brands/:category', async (req, res) => {
  try {
    const brands = await Product.distinct('brand', {
      category: req.params.category,
      isActive: true,
    });
    res.json(brands);
  } catch (error) {
    console.error('Brands fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching brands' });
  }
});

router.get('/retailer/my-products', retailerAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { retailer: req.user._id };
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    console.error('Retailer products fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching retailer products' });
  }
});

// Get product by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('retailer', 'name phone address')
      .populate('rating.count');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
});

// Create product (retailer only)
router.post('/', retailerAuth, [
  body('name').trim().isLength({ min: 3 }).withMessage('Product name must be at least 3 characters long'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(['engine-oil', 'brake-pads', 'air-filters', 'spark-plugs', 'batteries', 'tires', 'other']).withMessage('Invalid category'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('specifications.weight').optional().trim(),
  body('specifications.dimensions').optional().trim(),
  body('specifications.material').optional().trim(),
  body('specifications.compatibility').optional().trim(),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productData = {
      ...req.body,
      retailer: req.user._id
    };

    const product = new Product(productData);
    await product.save();

    const populatedProduct = await Product.findById(product._id)
      .populate('retailer', 'name');

    res.status(201).json({
      message: 'Product created successfully',
      product: populatedProduct
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: 'Server error while creating product' });
  }
});

// Update product (retailer only)
router.put('/:id', retailerAuth, [
  body('name').optional().trim().isLength({ min: 3 }).withMessage('Product name must be at least 3 characters long'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').optional().isIn(['engine-oil', 'brake-pads', 'air-filters', 'spark-plugs', 'batteries', 'tires', 'other']).withMessage('Invalid category'),
  body('brand').optional().trim().notEmpty().withMessage('Brand cannot be empty'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('images').optional().isArray({ min: 1 }).withMessage('At least one image is required'),
  body('isActive').optional().isBoolean(),
  body('isFeatured').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the product belongs to the authenticated retailer
    if (product.retailer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. You can only update your own products.' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('retailer', 'name');

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ message: 'Server error while updating product' });
  }
});

// Delete product (retailer only)
router.delete('/:id', retailerAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the product belongs to the authenticated retailer
    if (product.retailer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. You can only delete your own products.' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Product deletion error:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
});

// Update product quantity (retailer only)
router.patch('/:id/quantity', retailerAuth, [
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the product belongs to the authenticated retailer
    if (product.retailer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. You can only update your own products.' });
    }

    product.quantity = req.body.quantity;
    await product.save();

    res.json({
      message: 'Product quantity updated successfully',
      product
    });
  } catch (error) {
    console.error('Quantity update error:', error);
    res.status(500).json({ message: 'Server error while updating quantity' });
  }
});

module.exports = router; 