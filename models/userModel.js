const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
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
  address: {
    type: String,
  },
  wishlist: [{ type: mongoose.ObjectId, ref: "Product" }],
  refreshToken: {
    type: String
  },
  passwordChangedAt: {
    type: Date,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  }
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = async function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  
  return resetToken;
}

module.exports = mongoose.model("User", userSchema);