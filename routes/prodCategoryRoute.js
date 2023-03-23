const express = require('express');
const { createProdCategory, updateProdCategory } = require('../controller/prodCategoryCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createProdCategory);
router.put('/:id', authMiddleware, isAdmin, updateProdCategory);

module.exports = router;