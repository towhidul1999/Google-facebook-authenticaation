const userService = require("../services/userService");

module.exports = {
  allUsers: async function (req, res) {
    try {
      const users = await userService.usersList(req);
      res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  updateUser: async function (req, res) {
    const updateUser = await userService.updateUser({
      _id: req.params.id,
      username: req.body.username,
      displayPhoto: req.body.displayPhoto,
      fullName: req.body.fullName,
      nickName: req.body.nickName,
      DOB: req.body.DOB,
      telegramMobileNumber: req.body.telegramMobileNumber,
      password: req.body.password,
    });
    res.status(200).json(updateUser);
  },
};
