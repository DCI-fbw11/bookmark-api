const jwt = require("jsonwebtoken")
const { secret } = require("../config/config")

// Token verification function
const checkToken = async token => {
  try {
    const decodedToken = await jwt.verify(token, secret)
    return decodedToken
  } catch (error) {
    return null
  }
}

module.exports = checkToken
