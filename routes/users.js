const express = require("express")
const usersRouter = express.Router()

// Helpers
const sendJsonResp = require("../helpers/sendJsonResp")

// Middleware
const apiErrorMiddleware = require("../middleware/apiErrorMiddleware")
const checkToken = require("../middleware/checkToken")

// Controllers
const {
  checkPermissionController,
  getAllUsers,
  deleteOneUserByID
} = require("../controller/user")

const usersRoutes = {
  users: "/users",
  deleteUser: "/users/:id",
  all: "*"
}

// Protected Route Token Check
usersRouter.all(usersRoutes.all, checkToken, checkPermissionController)

// Get all users
usersRouter.get(usersRoutes.users, getAllUsers)

// Delete one user
usersRouter.delete(usersRoutes.deleteUser, deleteOneUserByID)

// The middleware that actually sends the response
usersRouter.use(sendJsonResp)

// Custom error handler
usersRouter.use(apiErrorMiddleware)

module.exports = { usersRouter, usersRoutes }
