const createError = (statusCode, errorMessage) => {
  let err = new Error(errorMessage)
  err.statusCode = statusCode
  throw err
}

module.exports = createError
