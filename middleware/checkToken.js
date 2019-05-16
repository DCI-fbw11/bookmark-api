const jwt = require("jsonwebtoken")
const { secret } = require("../config/config")

// Token verification middleware
const checkToken = async (req, res, next) => {
  try {
    const verified = await jwt.verify(req.headers.token, secret)
    console.log(verified)
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = checkToken
