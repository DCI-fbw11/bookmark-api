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
    //this probably has to be refactored ?
    if (!req.query.sortValue && !req.query.sortOrder) {
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
    }
    next()
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

  // perfect task for a DAO?
  sortBookmarks: async (req, res, next) => {
    const sortOrder = req.query.sortOrder === "ASC" ? 1 : -1
    let sortedBookmarks //move to try?
    try {
      sortedBookmarks =
        req.query.sortValue === "url"
          ? await Bookmark.aggregate([
              { $sort: { createdAt: sortOrder } },
              { $project: { title: 1, createdAt: 1, _id: 0 } }
            ])
          : await Bookmark.aggregate([
              { $sort: { url: sortOrder } },
              { $project: { title: 1, createdAt: 1, _id: 0 } }
            ])
      res.locals.response = Object.assign({}, res.locals.response || {}, {
        sorted_bookmarks: sortedBookmarks
      })
    } catch (err) {
      next(err)
    } finally {
      next()
    }
  },

  badRequest: (req, res, next) => {
    createError(400, noIDDefined)
    next()
  }
}
