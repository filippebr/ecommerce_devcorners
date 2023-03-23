const express = require('express');
const { 
  createBlogCategory, 
  getAllBlogCategory,
  getBlogCategory, 
  updateBlogCategory, 
  deleteBlogCategory,
} = require('../controller/blogCategoryCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBlogCategory);
router.get('/', getAllBlogCategory);
router.get('/:id', getBlogCategory);
router.put('/:id', authMiddleware, isAdmin, updateBlogCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteBlogCategory);

module.exports = router;