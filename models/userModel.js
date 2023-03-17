const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    default: 'user'
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  cart: {
    type: Array,
    default: [],
  },
  address: [{ type: mongoose.ObjectId, ref: "Address" }],
  wishlist: [{ type: mongoose.ObjectId, ref: "Product" }],
  refreshToken: {
    type: String
  }
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model("User", userSchema);