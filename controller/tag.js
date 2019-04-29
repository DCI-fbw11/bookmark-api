const Tag = require("../models/tag")

module.exports = {
  createTag: (req, res, next) => {
    const newTag = new Tag(req.body)
    newTag
      .save()
      .then(savedTag => {
        res.locals.response = Object.assign({}, res.locals.response || {}, {
          tag: savedTag,
          message: "Was successfully saved"
        })
      })
      .catch(err => console.error(err))
      .finally(() => next())
  },

  getTags: (req, res, next) => {
    Tag.find({})
      .then(tags => {
        if (!tags) {
          console.log("create error") // to do: createError
        } else {
          res.locals.response = Object.assign({}, res.locals.response || {}, {
            tags: tags
          })
        }
      })
      .catch(err => console.error(err))
      .finally(() => next())
  },

  updateTagById: (req, res, next) => {
    const { id } = req.params

    Tag.findByIdAndUpdate(id, { $set: req.body }, { new: true })
      .then(updatedTag => {
        res.locals.response = Object.assign({}, res.locals.response || {}, {
          tag: updatedTag,
          message: "Updated successfully"
        })
      })
      .catch(err => console.error(err))
      .finally(() => next())
  }
}
