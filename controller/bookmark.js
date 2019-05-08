const { validationResult } = require("express-validator/check")
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
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
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
    const updateBookmark = Object.assign({}, req.body, {
      updatedAt: Date.now()
    })

    Bookmark.findOneAndUpdate({ _id: id }, updateBookmark, {
      runValidators: true
    })
      .then(updatedBookmark => {
        res.locals.response = Object.assign({}, res.locals.response || {}, {
          bookmark: updatedBookmark,
          message: `Bookmark with id ${id} was updated!`
        })
      })
      .catch(err => {
        err.message = "Wrong ID please enter a valid ID"
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

  batchDeleteBookmarks: (req, res, next) => {
    const { bookmarkIDs } = req.body

    Bookmark.deleteMany({ _id: { $in: bookmarkIDs } })
      .then(() => {
        res.locals.response = Object.assign({}, res.locals.response || {}, {
          message: `Bookmark with id's ${bookmarkIDs.map(
            id => id
          )} were deleted!`
        })
      })
      .catch(err => next(err))
      .finally(() => next())
  },

  badRequest: (req, res, next) => {
    createError(400, noIDDefined)
    next()
  }
}
