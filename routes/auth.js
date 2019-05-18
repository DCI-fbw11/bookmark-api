const express = require("express")
const authRouter = express.Router()

// auth controller
const { register, login, deleteAccount } = require("../controller/auth")

// Helpers
const sendJsonResp = require("../helpers/sendJsonResp")

// Middleware
const checkToken = require("../middleware/checkToken")
const { apiErrorMiddleware } = require("../middleware/api")

const authRoutes = {
  register: "/register",
  login: "/login",
  deleteAccount: "/delete-account"
}

// Register user
authRouter.post(authRoutes.register, register)

// Login user
authRouter.post(authRoutes.login, login)

// Delete user
authRouter.delete(authRoutes.deleteAccount, checkToken, deleteAccount)

// The middleware that actually sends the response
authRouter.use(sendJsonResp)

// Custom error handler
authRouter.use(apiErrorMiddleware)

module.exports = { authRouter, authRoutes }
