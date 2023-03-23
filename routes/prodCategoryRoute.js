const express = require('express');
const { 
  createProdCategory, 
  updateProdCategory, 
  deleteProdCategory, 
  getProdCategory, 
  getAllProdCategory
} = require('../controller/prodCategoryCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createProdCategory);
router.get('/', getAllProdCategory);
router.get('/:id', getProdCategory);
router.put('/:id', authMiddleware, isAdmin, updateProdCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteProdCategory);

module.exports = router;