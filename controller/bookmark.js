const { validationResult } = require("express-validator/check")

const createError = require("../helpers/createError")
const {
  noBookmarkFound,
  noBookmarks,
  noIDDefined
} = require("../helpers/errorMessages")
const Bookmark = require("../models/bookmark")

module.exports = {
  getBookmarks: async (req, res, next) => {
    try {
      const bookmarkList = await Bookmark.find({})
      if (!bookmarkList) {
        createError(400, noBookmarks)
      } else {
        res.locals.response = Object.assign({}, res.locals.response || {}, {
          bookmark: bookmarkList
        })
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
    next()
  },

  getBookmarkByID: async (req, res, next) => {
    const { id } = req.params

    try {
      const foundBookmark = await Bookmark.findOne({ _id: id })
      if (!foundBookmark) {
        createError(400, noBookmarkFound)
      } else {
        res.locals.response = Object.assign({}, res.locals.response || {}, {
          bookmark: foundBookmark
        })
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
    next()
  },

  postBookmark: async (req, res, next) => {
    const newBookmark = new Bookmark(req.body)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    try {
      const savedBookmark = await newBookmark.save()
      res.locals.response = Object.assign({}, res.locals.response || {}, {
        bookmark: savedBookmark
      })
    } catch (error) {
      next(error)
    }
    next()
  },

  updateBookmarkById: async (req, res, next) => {
    const { id } = req.params
    const updateBookmark = Object.assign({}, req.body, {
      updatedAt: Date.now()
    })
    try {
      const updatedBookmark = await Bookmark.findOneAndUpdate(
        { _id: id },
        updateBookmark,
        {
          runValidators: true
        }
      )

      res.locals.response = Object.assign({}, res.locals.response || {}, {
        bookmark: updatedBookmark,
        message: `Bookmark with id ${id} was updated!`
      })
    } catch (error) {
      next(error)
    }
  },

  deleteBookmarkById: async (req, res, next) => {
    const { id } = req.params
    try {
      const deleteBookmark = Bookmark.findByIdAndRemove({ _id: id })
      res.locals.response = Object.assign({}, res.locals.response || {}, {
        bookmark: deleteBookmark,
        message: `Bookmark with id ${id} was deleted!`
      })
    } catch (error) {
      next(error)
    }
    next()
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
