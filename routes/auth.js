const express = require("express")
const authRouter = express.Router()

// auth controller
const {
  register,
  login,
  deleteAccount,
  changePassword
} = require("../controller/auth")

// Helpers
const sendJsonResp = require("../helpers/sendJsonResp")

// Middleware
const checkToken = require("../middleware/checkToken")
const apiErrorMiddleware = require("../middleware/apiErrorMiddleware")

const authRoutes = {
  register: "/register",
  login: "/login",
  deleteAccount: "/delete-account",
  changePassword: "/password"
}

// Register user
authRouter.post(authRoutes.register, register)

// Login user
authRouter.post(authRoutes.login, login)

// Change user password
authRouter.post(authRoutes.changePassword, changePassword)

// Delete user
authRouter.delete(authRoutes.deleteAccount, checkToken, deleteAccount)

// The middleware that actually sends the response
authRouter.use(sendJsonResp)

// Custom error handler
authRouter.use(apiErrorMiddleware)

module.exports = { authRouter, authRoutes }
