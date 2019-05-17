exports.apiErrorMiddleware = (error, req, res, next) => {
  if (!error.statusCode) error.statusCode = 500

  res.status(error.statusCode).json({
    error: error.message || "Unknown Error",
    data: res.locals.response || {}
  })
  next(error)
}
