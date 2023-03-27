const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');

const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwtToken');
const validateMongoDbId = require('../utils/validateMongodbId');
const generateRefreshToken = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailCtrl');
const resetUrlTemplate = require('../utils/resetUrlTemplate');
const crypto = require('crypto');

// Create a users
const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    // Create a new User
    const newUser = await User.create(req.body);
    res.json(newUser)
  } else {
    res.status(409).json({ message: 'User already exists' });
  }
});

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && await findUser.isPasswordMatched(password)) {
    const refreshToken = generateRefreshToken(findUser?._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    })
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    res.status(409).json({ message: 'Invalid Credentials' })
  }
});

// admin login 
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== 'admin') return res.status(401).json({ message: 'Invalid Credentials' });
  if (findAdmin && await findAdmin.isPasswordMatched(password)) {
    const refreshToken = generateRefreshToken(findAdmin?._id);
    const updateUser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken,
      }, 
      {
        new: true,
      }
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    })
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    res.status(409).json({ message: 'Invalid Credentials' })
  }
});


// handle refresh token
const handleRefreshToken = asyncHandler(async(req, res) => {
  const cookie = req.cookies;  
  if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookie');

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error('No Refresh Token present in db or not matched');

  jwt.verify(
    refreshToken,
    process.env.JWT_SECRET, 
    (err, decoded) => {
      if (err || user.id !== decoded.id) {
        throw new Error('There is something wrong with the refresh token')
      } 
      const accessToken = generateToken(user?._id);
      res.json({ accessToken });
    }
  )
});

// Logout functionality 

const logout = asyncHandler(async(req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookie');
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: '',
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
})

// Update a user
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      }, {
      new: true,
    });
    res.json(user);
  } catch (err) {
    throw new Error(err);
  }
})

// save user Address 
const saveAddress = asyncHandler(async(req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      }, 
      {
        new: true,
      }
    );
    res.json(user);
  } catch (err) {
    throw new Error(err);
  }
});

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (err) {
    throw new Error(err);
  }
})

// Get a single user
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const user = await User.findById(id);
    res.json({
      user,
    });
  } catch (err) {
    throw new Error(err);
  }
});

// Delete a User
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const user = await User.findByIdAndDelete(id);
    res.json({
      user,
    });
  } catch (err) {
    throw new Error(err);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(user)
  } catch (err) {
    throw new Error(err);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    )
    res.json(user)
  } catch (err) {
    throw new Error(err);
  }
});

const updatePassword = asyncHandler(async(req, res) => {
  const { id } = req.user;
  const { password } = req.body;
  validateMongoDbId(id);
  const user = await User.findById({_id: id});
  if ( password ) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async(req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  try {
    if ( !user ) return res.status(400).send({ error: "User not found" });
    const token = await crypto.randomBytes(20).toString('hex');

    await User.findByIdAndUpdate(user.id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: Date.now() + 30 * 60 * 1000,
      }, 
      
    }, { new: true });

    const resetURL = resetUrlTemplate(token);
    const data = {
      to: email,
      text: "Hey User. \n\nYou requested to change your password, if so.",
      subject: "Forgot Password Link",
      htm: resetURL,                  
    };
    sendEmail(data);
    res.json(token);
  } catch (err) {
    throw new Error(err);
  }
});

const resetPassword = asyncHandler(async(req, res) => {
  const { email, password } = req.body;
  const { token } = req.params;

  try {
    const user = await User.findOne({ email })
      .select('+passwordResetToken passwordResetExpires');
    
    if (!user) 
      return res.status(400).send({error: 'User not found'});

    if (token !== user.passwordResetToken)
      return res.status(400).send({ error: 'Token invalid'});

    const now = new Date();

    if (now > user.passwordResetExpires) 
      return res.status(400).send({ error: 'Token expired, generate a new one'});

    user.password = password;

    await user.save();

    res.json(user);
      
  } catch(err) {
    res.status(400).send({ error: 'Cannot reset password, try again'});
  }
});

const getWishlist = asyncHandler(async(req, res) => {
  const { _id } = req.user;
  
  try {
    const findUser = await User.find(_id).populate('wishlist');
    res.json(findUser);
  } catch (err) {
    throw new Error(err);
  }
});

const userCart = asyncHandler(async(req, res, next) => {
  const { cart } = req.body;
  const _id = req.user?._id;
  
  if (!_id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  validateMongoDbId(_id);
  
  try {
    let products = []
    const user = await User.findById(_id);
    // check if user already have product in cart
    const alreadyExistCart = await Cart.findOne({ orderBy: user._id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for ( let i = 0; i < cart.length; i++ ) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select('price').exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for ( let i = 0; i < products.length; i++ ) {
      cartTotal += products[i].price * products[i].count;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderBy: user?._id,
    }).save();
    res.json(newCart);
  } catch (err) {
    throw new Error(err);
  }
});

const getUserCart = asyncHandler(async(req, res) => {
  const {_id} = req.user;
  validateMongoDbId(_id);

  try {
    const cart = await Cart.findOne({ orderBy: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (err) {
    throw new Error(err);
  }
});

const emptyCart = asyncHandler(async(req, res) => {
  const {_id} = req.user;
  validateMongoDbId(_id);

  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderBy: user._id });
    res.json(cart);
  } catch (err) {
    throw new Error(err);
  }
});

const applyCoupon = asyncHandler(async(req, res) => {
  const { coupon } = req.body;
  const {_id} = req.user;
  validateMongoDbId(_id);

  const validCoupon = await Coupon.findOne({ name: coupon });  
  if ( validCoupon == null ) {
    res.status(401).json({ message: "Coupon not found"});
  }
  const user = await User.findOne({ _id });
  let { cartTotal } = await Cart.findOne({ 
    orderBy: user._id,
  }).populate("products.product");
  let totalAfterDiscount = ( 
    cartTotal - 
    ( cartTotal * validCoupon.discount ) / 100 
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderBy: user._id }, 
    { totalAfterDiscount }, 
    { new: true }
  );
  res.json(totalAfterDiscount);
});

module.exports = { 
  createUser, 
  loginUserCtrl, 
  getAllUsers, 
  getUser, 
  deleteUser, 
  updateUser, 
  blockUser, 
  unblockUser, 
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon
}; 