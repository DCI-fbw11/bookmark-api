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
      .catch(err => console.error(err))
      .finally(() => next())
  },

  getTags: (req, res, next) => {
    Tag.find({})
      .then(tags => {
        if (!tags) {
          console.log("handle error") // to do: error handling
        } else {
          res.locals.response = Object.assign({}, res.locals.response || {}, {
            tags: tags
          })
        }
      })
      .catch(err => console.error(err))
      .finally(() => next())
  }
}
