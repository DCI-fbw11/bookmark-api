const jwt = require("jsonwebtoken")
const { secret } = require("../config/config")

// Token verification middleware
const checkToken = async (req, res, next) => {
  try {
    await jwt.verify(req.headers.token, secret)

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = checkToken
