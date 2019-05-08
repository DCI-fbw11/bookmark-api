const { check } = require("express-validator/check")
const createError = require("../helpers/createError")

const checkURL = [check("url").isURL()]

const checkBody = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    createError(
      400,
      "no body found please enter body with field to update bookmark"
    )
  }
  next()
}

module.exports = {
  checkURL,
  checkBody
}
