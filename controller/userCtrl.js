const User = require('../models/userModel');

const createUser = async (req, res) => {
  const email = req.body.email
  const findUser = await User.find({ email });
  if (!findUser) {
    // Create a new User
    const newUser = User.create(req.body);
    res.json(newUser)
  } else {
    // User Already Exists 
    res.json({
      msg: "User already exists",
      success: false
    });
  }
}

module.exports = { createUser }; 