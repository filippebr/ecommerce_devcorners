const Coupon = require('../models/couponModel');
const validateMongoDbId = require('../utils/validateMongoDbId');
const asyncHandler = require('express-async-handler');

const createCoupon = asyncHandler(async(req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json(coupon);
  } catch (err) {
    throw new Error(err);
  }
});

const getAllCoupons = asyncHandler(async(req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    throw new Error(err);
  }
});

const updateCoupon = asyncHandler(async(req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const coupon = await Coupon.findByIdAndUpdate({_id: id},
      req.body, 
      { 
        new: true, runValidators: true
      }
    );
    res.json(coupon);
  } catch (err) {
    throw new Error(err);
  }
});

const deleteCoupon = asyncHandler(async(req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const coupon = await Coupon.findByIdAndDelete({_id: id});
    res.json(coupon);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon};