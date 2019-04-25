exports.apiErrorMiddleware = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500

  res.status(err.statusCode).json({
    error: err.message || "Unknown Error",
    data: res.locals.response || {}
  })
  next(err)
}
