const User = require("../models/user")
const isAuthorized = async (userID, role) => {
  try {
    const user = await User.findOne({ _id: userID })

    return user.role === role
  } catch (error) {
    return false
  }
}

module.exports = isAuthorized