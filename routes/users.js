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
const checkPermission = require("../middleware/checkPermission")

const usersRoutes = {
  users: "/users",
  deleteUser: "/users/:id",
  all: "*"
}

// Protected Route Token Check
usersRouter.all(usersRoutes.all, checkToken, async (req, res, next) => {
  await checkPermission(req, res, next, 'admin')
})

usersRouter.get(usersRoutes.users, async (req, res, next) => {
  try {
    const users = await User.find({})

    res.locals.response = Object.assign({}, res.locals.response || {}, {
      users
    })
  } catch(error) {
    next(error)
  }

  next()
})

usersRouter.delete(usersRoutes.deleteUser, async (req, res, next) => {
  // Delete user login
  try {
    await User.findOneAndDelete({
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

  next()
})

usersRouter.use(sendJsonResp)

usersRouter.use(apiErrorMiddleware)

module.exports = { usersRouter }
