const decodeToken = require("../helpers/decodeToken")
const isAuthorized = require("../helpers/isAuthorized")
const createError = require("../helpers/createError")

const checkPermission = async (req, res, next, role) => {
  try {
    const { user: userID } = await decodeToken(req.headers.token)
    const isAdmin = await isAuthorized(userID, role)

    if (isAdmin) {
      next()
    } else {
      // Not authorized
      createError(401, "Not authorized")
    }
  } catch(error) {
    next(error)
  }
}

module.exports = checkPermission
