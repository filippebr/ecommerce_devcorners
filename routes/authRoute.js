const express = require('express');
const { createUser, loginUserCtrl, getAllUsers, getUser } = require('../controller/userCtrl');
const router = express.Router()

router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.get('/users', getAllUsers);
router.get('/:id', getUser);

module.exports = router;