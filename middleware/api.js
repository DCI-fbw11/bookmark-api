const createError = require("../helpers/createError")

exports.apiErrorMiddleware = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500

  res.status(err.statusCode).json({
    error: err.message || "Unknown Error",
    data: res.locals.response || {}
  })
  next(err)
}

exports.isBodyValid = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    createError(400, "please enter a body no body found")
  }
  next()
}
