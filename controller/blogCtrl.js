const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

const createBlog = asyncHandler(async(req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json(newBlog);
  } catch(err) {
    throw new Error(err);
  }
});

const updateBlog = asyncHandler(async(req, res) => {
  const { id } = req.params;
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { 
      new: true 
    });
    res.json(updateBlog);
  } catch(err) {
    throw new Error(err);
  }
});

module.exports = { createBlog, updateBlog };
