const createError = (statusCode, errorMessage) => {
  let error = new Error(errorMessage)
  error.statusCode = statusCode
  throw error
}

module.exports = createError
