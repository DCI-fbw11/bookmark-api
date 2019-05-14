const jwt = require("jsonwebtoken")
const { secret } = require("../config/config")

const createToken = (user, isMatching) =>
  isMatching
    ? jwt.sign({ user: user._id }, secret, {
        expiresIn: "1h"
      })
    : null

module.exports = createToken
