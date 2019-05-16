const jwt = require("jsonwebtoken")
const { secret } = require("../config/config")
const createError = require("./createError")

// Token verification function
const checkToken = async token => {
  try {
    const decodedToken = await jwt.verify(token, secret)
    return decodedToken
  } catch (error) {
    createError(400, "bla")
  }
}

module.exports = checkToken
