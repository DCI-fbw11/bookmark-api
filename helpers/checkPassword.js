const bcrypt = require("bcrypt")

const checkPassword = async (plainTextPassword, hashedPassword) => {
  return await bcrypt.compare(plainTextPassword, hashedPassword)
}

module.exports = checkPassword
