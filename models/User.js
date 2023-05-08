const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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
