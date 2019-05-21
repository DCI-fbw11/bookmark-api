const { check } = require("express-validator/check")

// Helpers
const createError = require("../helpers/createError")
const { emptyBody } = require("../helpers/errorMessages")

const checkURL = [check("url").isURL()]

const checkBody = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    createError(400, emptyBody)
  }
  next()
}

module.exports = {
  checkURL,
  checkBody
}
