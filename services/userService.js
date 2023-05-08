const User = require("../models/User");

async function usersList(data) {
  const users = await User.find({});
  return users;
}

async function updateUser(data) {
  const updateUser = await User.findOne(data.id);
  updateUser.username = data.username;
  updateUser.displayPhoto = data.displayPhoto;
  updateUser.fullName = data.fullName;
  updateUser.nickName = data.nickName;
  updateUser.DOB = data.DOB;
  updateUser.telegramMobileNumber = data.telegramMobileNumber;
  updateUser.password = data.password;
  await updateUser.save();
  return updateUser;
}

module.exports = {
  usersList,
  updateUser,
};
