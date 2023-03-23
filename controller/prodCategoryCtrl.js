const ProdCategory = require('../models/prodCategoryModel.js');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

const createProdCategory = asyncHandler(async(req, res) => {
  try {
    const category = await ProdCategory.create(req.body);

    res.json(category);
  } catch(err) {
    throw new Error(err);
  }
});

const updateProdCategory = asyncHandler(async(req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const category = await ProdCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(category);
  } catch(err) {
    throw new Error(err);
  }
});

module.exports = { createProdCategory, updateProdCategory };