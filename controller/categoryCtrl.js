const Category = require('../models/categoryModel.js');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

const createCategory = asyncHandler(async(req, res) => {
  try {
    const category = await Category.create(req.body);

    res.json(category);
  } catch(err) {
    throw new Error(err);
  }
});

module.exports = { createCategory };