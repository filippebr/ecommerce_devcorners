const express = require('express');
const { createUser, loginUserCtrl, getAllUsers, getUser, deleteUser, updateUser } = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router()

router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.get('/users', getAllUsers);
router.get('/:id', authMiddleware, isAdmin, getUser);
router.delete('/:id', deleteUser);
router.put('/editUser', authMiddleware, updateUser);

module.exports = router;