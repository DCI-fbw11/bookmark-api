const User = require("../models/user.js")

//helpers
const { hashPassword, checkPassword } = require("../helpers/hash")
const createToken = require("../helpers/createToken")
const createError = require("../helpers/createError")

module.exports = {
  register: async (req, res, next) => {
    const { registerData } = req.body

    try {
      const hash = await hashPassword(registerData.password)

      if (!hash) {
        next(createError(500, "Hash failed"))
      }

      const userInfo = {
        ...registerData,
        password: hash
      }

      const newUser = await new User(userInfo).save()

      // Delete pass before sending in res
      const hashedUser = newUser.toObject()
      delete hashedUser.password

      res.locals.response = Object.assign({}, res.locals.response || {}, {
        hashedUser
      })
    } catch (error) {
      next(error)
    }

    next()
  },
  login: async (req, res, next) => {
    const { username, password } = req.body.loginData
    try {
      // find user
      const user = await User.findOne({ username })
      // compare passwords with bcrypt
      // succes -> get hashsed pass from db
      const isMatching = await checkPassword(password, user.password)
      // Generate token
      const token = createToken(user, isMatching)

      const message = isMatching ? "Login success!!" : "Login failed"
      // success -> thumbs up
      // fail -> login failed
      res.locals.response = Object.assign({}, res.locals.response || {}, {
        message,
        token,
        userID: user._id
      })
    } catch (error) {
      next(error)
    }

    next()
  }
}
