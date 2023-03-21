const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

const createBlog = asyncHandler(async(req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch(err) {
    throw new Error(err);
  }
});

const updateBlog = asyncHandler(async(req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByIdAndUpdate(id, req.body, { 
      new: true 
    });
    res.json(blog);
  } catch(err) {
    throw new Error(err);
  }
});

const getBlog = asyncHandler(async(req, res) => {
  const { id } = req.params;
  try {
    const updateViews = await Blog.findByIdAndUpdate(
      id, 
      {
        $inc: {numViews: 1}
      }, 
      {new: true}
    );
    res.json(updateViews);
  } catch(err) {
    throw new Error(err);
  }
});

module.exports = { createBlog, updateBlog, getBlog };
