const Coupon = require('../models/couponModel');
const validateMongoDbId = require('../utils/validateMongoDbId');
const asyncHandler = require('express-async-handler');

const createCoupon = asyncHandler(async(req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = { createCoupon };