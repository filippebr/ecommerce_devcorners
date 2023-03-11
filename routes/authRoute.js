const express = require('express');
const { createUser } = require('../controller/userCtrl');
const router = express.Router()
createUser

router.post('/register', createUser);
module.exports = router;