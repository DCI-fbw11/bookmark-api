const { validationResult } = require("express-validator/check")
const checkIfUnique = require("../helpers/checkIfUniqe")
const createError = require("../helpers/createError")
const {
  noBookmarkFound,
  noBookmarks,
  noMatchingRoutes,
  duplicateTags
} = require("../helpers/errorMessages")
const Bookmark = require("../models/bookmark")

module.exports = {
  //get all current bookmarks
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
      next(err)
    }
    next()
  },

  //creates a new bookmark
  postBookmark: async (req, res, next) => {
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
    next()
  },

  deleteBookmarkById: async (req, res, next) => {
    const { id } = req.params
    try {
      const deleteBookmark = await Bookmark.findByIdAndRemove({ _id: id })
      res.locals.response = Object.assign({}, res.locals.response || {}, {
        bookmark: deleteBookmark,
        message: `Bookmark with id ${id} was deleted!`
      })
    } catch (error) {
      next(error)
    }
    next()
  },

  //delete multiple bookmarks
  batchDeleteBookmarks: async (req, res, next) => {
    const { bookmarkIDs } = req.body
    try {
      await Bookmark.deleteMany({ _id: { $in: bookmarkIDs } })
      res.locals.response = Object.assign({}, res.locals.response || {}, {
        message: `Bookmark with id's ${bookmarkIDs.map(id => id)} were deleted!`
      })
    } catch (error) {
      next(error)
    }
    next()
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
