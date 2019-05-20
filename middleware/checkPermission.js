// Helpers
const decodeToken = require("../helpers/decodeToken")
const isAuthorized = require("../helpers/isAuthorized")
const createError = require("../helpers/createError")

// Error Messages
const { notAuthorized } = require("../helpers/errorMessages")

const checkPermission = async (req, res, next, role) => {
  try {
    const { user: userID } = await decodeToken(req.headers.token)
    const isAdmin = await isAuthorized(userID, role)

    if (isAdmin) {
      next()
    } else {
      // Not authorized
      createError(401, notAuthorized)
    }
  } catch (error) {
    next(error)
  }
}

module.exports = checkPermission
