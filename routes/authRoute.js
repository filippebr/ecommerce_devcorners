const express = require('express');
const { 
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
  applyCoupon,
  createOrder,
  getOrders
} = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router()

router.post('/register', createUser);
router.post('/forgotPasswordToken', forgotPasswordToken);
router.put('/resetPassword/:token', resetPassword);

router.put('/password', authMiddleware, updatePassword);
router.post('/login', loginUserCtrl);
router.post('/adminLogin', loginAdmin);
router.post('/cart', authMiddleware, userCart);
router.post('/cart/applyCoupon', authMiddleware, applyCoupon);
router.post('/cart/cashOrder', authMiddleware, createOrder);
router.get('/users', getAllUsers);
router.get('/getOrders', authMiddleware, getOrders);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.get('/wishlist', authMiddleware, getWishlist);
router.get('/cart', authMiddleware, getUserCart);

router.get('/:id', authMiddleware, isAdmin, getUser);
router.delete('/emptyCart', authMiddleware, emptyCart);
router.delete('/:id', deleteUser);

router.put('/editUser', authMiddleware, updateUser);
router.put('/saveAddress', authMiddleware, saveAddress);
router.put('/blockUser/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblockUser/:id', authMiddleware, isAdmin, unblockUser);

module.exports = router;