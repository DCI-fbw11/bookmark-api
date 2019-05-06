const createError = require("../helpers/createError")
const {
  noBookmarkFound,
  noBookmarks,
  noIDDefined
} = require("../helpers/errorMessages")
const Bookmark = require("../models/bookmark")

module.exports = {
  getBookmarks: (req, res, next) => {
    Bookmark.find({})
      .then(bookmarkList => {
        if (!bookmarkList) {
          createError(400, noBookmarks)
        } else {
          res.locals.response = Object.assign({}, res.locals.response || {}, {
            bookmark: bookmarkList
          })
        }
      })
      .catch(err => next(err))
      .finally(() => next())
  },

  getBookmarkByID: (req, res, next) => {
    const { id } = req.params

    Bookmark.findOne({ _id: id })
      .then(foundBookmark => {
        if (!foundBookmark) {
          createError(400, noBookmarkFound)
        } else {
          res.locals.response = Object.assign({}, res.locals.response || {}, {
            bookmark: foundBookmark
          })
        }
      })
      .catch(err => next(err))
      .finally(() => next())
  },

  postBookmark: (req, res, next) => {
    const newBookmark = new Bookmark(req.body)

    newBookmark
      .save()
      .then(savedBookmark => {
        res.locals.response = Object.assign({}, res.locals.response || {}, {
          bookmark: savedBookmark
        })
      })
      .catch(err => {
        next(err)
      })
      .finally(() => {
        next()
      })
  },

  updateBookmarkById: (req, res, next) => {
    const { id } = req.params
    //const updateBookmark = req.body
    const updateBookmark = Object.assign({}, req.body, {
      updatedAt: Date.now()
    })

    Bookmark.findOneAndUpdate({ _id: id }, updateBookmark, { new: true })
      .then(updatedBookmark => {
        res.locals.response = Object.assign({}, res.locals.response || {}, {
          bookmark: updatedBookmark
        })
      })
      .catch(err => {
        next(err)
      })
      .finally(() => {
        next()
      })
  },

  deleteBookmarkById: (req, res, next) => {
    const { id } = req.params

    Bookmark.findByIdAndRemove({ _id: id })
      .then(deleteBookmark => {
        res.locals.response = Object.assign({}, res.locals.response || {}, {
          bookmark: deleteBookmark,
          message: `Bookmark with id ${id} was deleted!`
        })
      })
      .catch(err => {
        next(err)
      })
      .finally(() => {
        next()
      })
  },

  badRequest: (req, res, next) => {
    createError(400, noIDDefined)
    next()
  }
}
