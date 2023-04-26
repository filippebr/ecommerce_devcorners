const BlogCategory = require('../models/blogCategoryModel.js');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongoDbId');

const createBlogCategory = asyncHandler(async(req, res) => {
  try {
    const category = await BlogCategory.create(req.body);

    res.json(category);
  } catch(err) {
    throw new Error(err);
  }
});

const updateBlogCategory = asyncHandler(async(req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const category = await BlogCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(category);
  } catch(err) {
    throw new Error(err);
  }
});

const deleteBlogCategory = asyncHandler(async(req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const category = await BlogCategory.findByIdAndDelete(id);

    res.json(category);
  } catch(err) {
    throw new Error(err);
  }
});

const getBlogCategory = asyncHandler(async(req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const category = await BlogCategory.findById(id);

    res.json(category);
  } catch(err) {
    throw new Error(err);
  }
});

const getAllBlogCategory = asyncHandler(async(req, res) => {

  try {
    const category = await BlogCategory.find();

    res.json(category);
  } catch(err) {
    throw new Error(err);
  }
});

module.exports = { 
  createBlogCategory, 
  updateBlogCategory, 
  deleteBlogCategory, 
  getBlogCategory,
  getAllBlogCategory,
};