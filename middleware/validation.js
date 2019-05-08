const { check } = require("express-validator/check")

const checkURL = [check("url").isURL()]

module.exports = {
  checkURL
}
