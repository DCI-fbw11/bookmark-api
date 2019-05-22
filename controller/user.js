// Model
const User = require("../models/user")

// Middleware
const checkPermission = require("../middleware/checkPermission")

// Helpers
const cleanUpAfterUserDeletion = require("../helpers/cleanUpAfterUserDeletion")

module.exports = {
  // @route   N/A
  // @desc    Controller + Middleware Function
  // @access  Private (Role: "admin")
  checkPermissionController: async (req, res, next) => {
    await checkPermission(req, res, next, "admin")
  },
  // @route   GET admin/users
  // @desc    Lists all registered users
  // @access  Private (Role: "admin")
  getAllUsers: async (req, res, next) => {
    try {
      const users = await User.find({})

      res.locals.response = Object.assign({}, res.locals.response || {}, {
        users
      })
    } catch (error) {
      next(error)
    }

    next()
  },

  // @route   DELETE admin/users/:id
  // @desc    Delete one user by ID
  // @access  Private (Role: "admin")
  deleteOneUserByID: async (req, res, next) => {
    try {
      await User.findOneAndDelete({
        _id: req.params.id
      })

      await cleanUpAfterUserDeletion(req.params.id)

      res.locals.response = Object.assign({}, res.locals.response || {}, {
        message: `User with id ${req.params.id} deleted`
      })
    } catch (error) {
      next(error)
    }

    next()
  }
}
