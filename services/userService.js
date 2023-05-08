const User = require("../models/User");

async function usersList(data) {
  const users = await User.find({});
  return users;
}

module.exports = {
  usersList,
};
