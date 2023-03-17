const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (err) {
    throw new Error(err);
  }  
});

const updateProduct = asyncHandler(async(req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const product = await Product.findOneAndUpdate({_id: id}, 
      req.body, 
      {
        new: true,
        runValidators: true
      }
    );
    res.json(product);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteProduct = asyncHandler(async(req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOneAndDelete({_id: id});
    res.json(product);
  } catch (err) {
    throw new Error(err);
  }
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (err) {
    throw new Error(err);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const getProducts = await Product.find();
    res.json(getProducts);
  } catch (err) {
    throw new Error(err);
  }
}); 

module.exports = { 
  createProduct, 
  getProduct, 
  getAllProducts, 
  updateProduct, 
  deleteProduct
};