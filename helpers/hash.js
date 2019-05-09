const bcrypt = require("bcrypt")

const hashPassword = async (plainTextPassword) => {
	const saltRounds = 10

  try {
    const hash = await bcrypt.hash(plainTextPassword, saltRounds)
    return hash
  } catch(error) {
    return null
  }
}

const checkPassword = async (plainTextPassword, hashedPassword) => {
  return await bcrypt.compare(plainTextPassword, hashedPassword)
}

module.exports = { hashPassword, checkPassword }