const express = require('express');
const { 
  createProduct, 
  getProduct, 
  getAllProducts, 
  updateProduct, 
  deleteProduct, 
  addToWishList,
  rating,
  uploadProdImages,
} = require('../controller/productCtrl');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');
const router = express.Router();


router.post('/', authMiddleware, isAdmin, createProduct);
router.put(
  '/upload/:id', 
  authMiddleware, 
  isAdmin, 
  uploadPhoto.array('images', 10), 
  productImgResize, 
  uploadProdImages
);

router.get('/products', getAllProducts);
router.put('/wishlist', authMiddleware, addToWishList);
router.put('/rating', authMiddleware, rating);

router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.get('/:id', getProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);


module.exports = router;