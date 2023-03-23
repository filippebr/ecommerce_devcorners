const Brand = require('../models/brandModel.js');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

const createBrand = asyncHandler(async(req, res) => {
  try {
    const brand = await Brand.create(req.body);

    res.json(brand);
  } catch(err) {
    throw new Error(err);
  }
});

const updateBrand = asyncHandler(async(req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const brand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(brand);
  } catch(err) {
    throw new Error(err);
  }
});

const deleteBrand = asyncHandler(async(req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const brand = await Brand.findByIdAndDelete(id);

    res.json(brand);
  } catch(err) {
    throw new Error(err);
  }
});

const getBrand = asyncHandler(async(req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const brand = await Brand.findById(id);

    res.json(brand);
  } catch(err) {
    throw new Error(err);
  }
});

const getAllBrand = asyncHandler(async(req, res) => {

  try {
    const brand = await Brand.find();

    res.json(brand);
  } catch(err) {
    throw new Error(err);
  }
});

module.exports = { 
  createBrand, 
  updateBrand, 
  deleteBrand, 
  getBrand,
  getAllBrand,
};