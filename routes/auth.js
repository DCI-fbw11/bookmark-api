const express = require("express")
const authRouter = express.Router()
const User = require("../models/user.js")
// Helpers
const createError = require("../helpers/createError")
const { hashPassword, checkPassword } = require("../helpers/hash")

//Keys
require("dotenv").config()
const secret = process.env.SECRET

const jwt = require("jsonwebtoken")

// Helpers
const sendJsonResp = require("../helpers/sendJsonResp")

// Middleware
const { apiErrorMiddleware } = require("../middleware/api")
// TODO ednpoints
// register
// login
// logout
// delete

const authRoutes = {
  register: "/register",
  login: "/login"
}

// Login user
authRouter.post(authRoutes.login, async (req, res, next) => {
  const { username, password } = req.body.loginData
  try {
    // find user
    const user = await User.findOne({ username })
    // compare passwords with bcrypt
    // succes -> get hashsed pass from db
    const isMatching = await checkPassword(password, user.password)
    // Generate token
    const token = isMatching
      ? jwt.sign({ user: user._id }, secret, {
          expiresIn: "1h"
        })
      : null

    const message = isMatching ? "Login success!!" : "Login failed"
    // success -> thumbs up
    // fail -> login failed
    res.locals.response = Object.assign({}, res.locals.response || {}, {
      message,
      token
    })
  } catch (error) {
    next(error)
  }

  next()
})

// Register user
authRouter.post(authRoutes.register, async (req, res, next) => {
  // TODO validate stuff...
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
})

// The middleware that actually sends the response
authRouter.use(sendJsonResp)

// Custom error handler
authRouter.use(apiErrorMiddleware)

module.exports = { authRouter }
