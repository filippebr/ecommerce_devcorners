const express = require('express');
const { 
  createUser, 
  loginUser, 
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
  getOrders,
  updateOrderStatus
} = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router()

router.post('/register', createUser);
router.post('/forgotPasswordToken', forgotPasswordToken);
router.put(
  '/order/updateOrder/:id', 
  authMiddleware, 
  isAdmin, 
  updateOrderStatus
);
router.put('/resetPassword/:token', resetPassword);  

router.put('/password', authMiddleware, updatePassword);
router.post('/login', loginUser);
router.post('/admin-login', loginAdmin);
router.post('/cart', authMiddleware, userCart);
router.post('/cart/apply-coupon', authMiddleware, applyCoupon);
router.post('/cart/cash-order', authMiddleware, createOrder);
router.get('/users', getAllUsers);
router.get('/get-orders', authMiddleware, getOrders);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.get('/wishlist', authMiddleware, getWishlist);
router.get('/cart', authMiddleware, getUserCart);

router.get('/:id', authMiddleware, isAdmin, getUser);
router.delete('/empty-cart', authMiddleware, emptyCart);
router.delete('/:id', deleteUser);

router.put('/editUser', authMiddleware, updateUser);
router.put('/save-address', authMiddleware, saveAddress);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

module.exports = router;