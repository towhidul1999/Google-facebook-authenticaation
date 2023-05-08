const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  displayPhoto: {
    type: String,
    required: false,
  },
  fullName: {
    type: String,
    required: false,
  },
  nickName: {
    type: String,
    required: false,
  },
  DOB: {
    type: String,
    required: false,
  },
  telegramMobileNumber: {
    type: Number,
    required: false,
  },
  googleId: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
