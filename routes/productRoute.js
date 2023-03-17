const express = require('express');
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct } = require('../controller/productCtrl');
const router = express.Router();

router.post('/', createProduct);
router.get('/products', getAllProducts);
router.put('/:id', updateProduct);
router.get('/:id', getProduct);
router.delete('/:id', deleteProduct);


module.exports = router;