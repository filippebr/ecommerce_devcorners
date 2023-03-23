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
  validateMongoDbId(id);
  try {
    const category = await ProdCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(category);
  } catch(err) {
    throw new Error(err);
  }
});

const deleteProdCategory = asyncHandler(async(req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const category = await ProdCategory.findByIdAndDelete(id);

    res.json(category);
  } catch(err) {
    throw new Error(err);
  }
});

const getProdCategory = asyncHandler(async(req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const category = await ProdCategory.findById(id);

    res.json(category);
  } catch(err) {
    throw new Error(err);
  }
});

const getAllProdCategory = asyncHandler(async(req, res) => {

  try {
    const category = await ProdCategory.find();

    res.json(category);
  } catch(err) {
    throw new Error(err);
  }
});

module.exports = { 
  createProdCategory, 
  updateProdCategory, 
  deleteProdCategory, 
  getProdCategory,
  getAllProdCategory,
};