const express = require("express")
const usersRouter = express.Router()

const User = require("../models/user")

// Helpers
const sendJsonResp = require("../helpers/sendJsonResp")
const createError = require("../helpers/createError")
const decodeToken = require("../helpers/decodeToken")
const isAuthorized = require("../helpers/isAuthorized")

// Middleware
const { apiErrorMiddleware } = require("../middleware/api")
const checkToken = require("../middleware/checkToken")


const usersRoutes = {
  users: "/users",
  deleteUser: "/users/:id",
  all: "*"
}

// Protected Route Token Check
usersRouter.all(usersRoutes.all, checkToken)

usersRouter.get(usersRoutes.users, async (req, res, next) => {
  try {
    const { user: userID } = await decodeToken(req.headers.token)
    const isAdmin = isAuthorized(userID, 'admin')

    if (isAdmin) {
      try {
        const users = await User.find({})

        res.locals.response = Object.assign({}, res.locals.response || {}, {
          users
        })
      } catch(error) {
        next(error)
      }
    } else {
      // Not authorized
      const error = createError(401, 'Not authorized')
    }
  } catch(error) {
    next(error)
  }

  next()
})

usersRouter.delete(usersRoutes.deleteUser, async (req, res, next) => {
  // Delete user login

  try {
    const { user: userID } = await decodeToken(req.headers.token)
    const isAdmin = isAuthorized(userID, 'admin')

    if (isAdmin) {
      try {
        const users = await User.findOneAndDelete({
          _id: req.params.id
        })

        res.locals.response = Object.assign(
          {},
          res.locals.response || {}, {
          message: `User with id ${req.params.id} deleted`
        })
      } catch(error) {
        next(error)
      }
    } else {
      // Not authorized
      const error = createError(401, 'Not authorized')
    }
  } catch(error) {
    next(error)
  }

  next()
})

usersRouter.use(sendJsonResp)

usersRouter.use(apiErrorMiddleware)

module.exports = { usersRouter }
