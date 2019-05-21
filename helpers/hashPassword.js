const bcrypt = require("bcrypt")

const hashPassword = async plainTextPassword => {
  const saltRounds = 10

  try {
    const hash = await bcrypt.hash(plainTextPassword, saltRounds)
    return hash
  } catch (error) {
    return null
  }
}

module.exports = hashPassword
