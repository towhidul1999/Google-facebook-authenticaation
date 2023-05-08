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
};
