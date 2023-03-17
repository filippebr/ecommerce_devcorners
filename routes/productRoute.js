const express = require('express');
const { createProduct, getProduct, getAllProducts } = require('../controller/productCtrl');
const router = express.Router();

router.post('/', createProduct);
router.get('/products', getAllProducts);
router.get('/:id', getProduct);


module.exports = router;