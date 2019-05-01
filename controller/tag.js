const Tag = require("../models/tag")
const createError = require("../helpers/createError")
const errorMessages = require("../helpers/errorMessages")
module.exports = {
  createTag: (req, res, next) => {
    const newTag = new Tag(req.body)
    newTag
      .save()
      .then(savedTag => {
        res.locals.response = Object.assign({}, res.locals.response || {}, {
          tag: savedTag
        })
      })
      .catch(err => {
        if (err.name === "ValidationError") {
          err.statusCode = 400
        } // move validation to schema later to avoid duplicating on each controller?
        next(err)
      })
      .finally(() => next())
  }
}
