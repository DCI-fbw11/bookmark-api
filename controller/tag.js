const Tag = require("../models/tag")

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
        console.error(err)
      })
      .finally(() => next())
  }
}
