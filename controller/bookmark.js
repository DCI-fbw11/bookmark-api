const { validationResult } = require("express-validator/check")
const checkIfUnique = require("../helpers/checkIfUniqe")
const createError = require("../helpers/createError")
const {
  noBookmarkFound,
  noBookmarks,
  noMatchingRoutes,
  invalidID,
  duplicateTags
} = require("../helpers/errorMessages")
const Bookmark = require("../models/bookmark")

module.exports = {
  getBookmarks: (req, res, next) => {
    if (!req.query.sortValue && !req.query.sortOrder) {
      // get all bookmarks as long as there's no query
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
      .catch(err => {
        err.message = invalidID
        next(err)
      })
      .finally(() => next())
  },

  postBookmark: (req, res, next) => {
    const newBookmark = new Bookmark(req.body)
    const errors = validationResult(req)
    const unique = req.body.tag ? checkIfUnique(req.body.tag) : true
    if (!errors.isEmpty()) {
      createError(
        422,
        `${errors
          .array()
          .map(error => error.msg + ": " + error.param.toUpperCase())}`
      )
    } else if (!unique) {
      createError(400, duplicateTags)
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
    const errors = validationResult(req)
    const unique = req.body.tag ? checkIfUnique(req.body.tag) : true
    if (!errors.isEmpty()) {
      createError(
        422,
        `${errors
          .array()
          .map(error => error.msg + ": " + error.param.toUpperCase())}`
      )
    } else if (!unique) {
      createError(400, duplicateTags)
    }
    const updateBookmark = Object.assign({}, req.body, {
      updatedAt: Date.now()
    })

    Bookmark.findOneAndUpdate({ _id: id }, updateBookmark, {
      runValidators: true,
      useFindAndModify: false,
      new: true
    })
      .then(updatedBookmark => {
        res.locals.response = Object.assign({}, res.locals.response || {}, {
          bookmark: updatedBookmark,
          message: `Bookmark with id ${id} was updated!`
        })
      })
      .catch(err => {
        err.message = invalidID
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
        err.message = invalidID
        next(err)
      })
      .finally(() => {
        next()
      })
  },

  sortBookmarks: async (req, res, next) => {
    const sortOrder = req.query.sortOrder === "ASC" ? 1 : -1
    let sortedBookmarks
    try {
      sortedBookmarks =
        req.query.sortValue === "url"
          ? await Bookmark.aggregate([{ $sort: { url: sortOrder } }])
          : await Bookmark.aggregate([{ $sort: { createdAt: sortOrder } }])
      res.locals.response = Object.assign({}, res.locals.response || {}, {
        sorted_bookmarks: sortedBookmarks
      })
    } catch (err) {
      next(err)
    } finally {
      next()
    }
  },
  batchDeleteBookmarks: (req, res, next) => {
    const { bookmarkIDs } = req.body

    Bookmark.deleteMany({ _id: { $in: bookmarkIDs } })
      .then(deleted => {
        if (deleted.deletedCount === 0) {
          createError(400, invalidID)
        }

        res.locals.response = Object.assign({}, res.locals.response || {}, {
          message: `Bookmark with id's ${bookmarkIDs.map(
            id => id
          )} were deleted!`
        })
      })
      .catch(err => next(err))
      .finally(() => next())
  },

  noMatch: (req, res, next) => {
    if (res.locals.response) {
      next()
    } else {
      createError(404, noMatchingRoutes)
      next()
    }
  }
}
