const User = require("../models/user")

//helpers
const hashPassword = require("../helpers/hashPassword")
const checkPassword = require("../helpers/checkPassword")
const createToken = require("../helpers/createToken")
const createError = require("../helpers/createError")
const decodeToken = require("../helpers/decodeToken")

const cleanUpAfterUserDeletion = require("../helpers/cleanUpAfterUserDeletion")
const {
  couldNotRegister,
  couldNotLogin,
  couldNotChangePassword,
  couldNotDeleteAccount
} = require("../helpers/errorMessages")

module.exports = {
  // @route   POST auth/register
  // @desc    Register a new user
  // @access  Public
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
      delete hashedUser.role

      res.locals.response = Object.assign({}, res.locals.response || {}, {
        hashedUser
      })
    } catch (error) {
      error.message = couldNotRegister
      next(error)
    }

    next()
  },

  // @route   POST auth/login
  // @desc    Login a registered user
  // @access  Public
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

      res.locals.response = Object.assign({}, res.locals.response || {}, {
        message,
        token,
        userID: user._id
      })
    } catch (error) {
      error.message = couldNotLogin
      next(error)
    }

    next()
  },
  // @route   POST auth/password
  // @desc    Change a users password
  // @access  Public
  changePassword: async (req, res, next) => {
    const {
      username,
      password: oldPassword,
      new_password: newPassword
    } = req.body.loginData
    try {
      const user = await User.findOne({ username })
      
      const isMatching = await checkPassword(oldPassword, user.password)

      if (isMatching) {
        const hashedNewPassword = await hashPassword(newPassword)
        user.password = hashedNewPassword
        await user.save()
      }

      const message = isMatching
        ? "Password change success"
        : "Old password is wrong, password change failed"

      res.locals.response = Object.assign({}, res.locals.response || {}, {
        message,
        userID: user._id
      })
    } catch (error) {
      error.message = couldNotChangePassword
      next(error)
    }

    next()
  },

  // @route   DELETE auth/delete-account
  // @desc    Delete a registered user account
  // @access  Private
  deleteAccount: async (req, res, next) => {
    try {
      const { user: userID } = await decodeToken(req.headers.token)

      // Delete User
      await User.findOneAndDelete({ _id: userID })

      // Delete Bookmarks
      await cleanUpAfterUserDeletion(userID)

      res.locals.response = Object.assign({}, res.locals.response || {}, {
        message: `Account with ID:${userID} has been successfully deleted.`
      })
    } catch (error) {
      error.message = couldNotDeleteAccount
      next(error)
    }

    next()
  }
}
