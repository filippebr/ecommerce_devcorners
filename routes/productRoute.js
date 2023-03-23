const express = require('express');
const { 
  createProduct, 
  getProduct, 
  getAllProducts, 
  updateProduct, 
  deleteProduct, 
  addToWishList
} = require('../controller/productCtrl');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createProduct);
router.get('/products', getAllProducts);
router.put('/wishlist', authMiddleware, addToWishList);
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.get('/:id', getProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);


module.exports = router;