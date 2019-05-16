const { validationResult } = require("express-validator/check")
const checkIfUnique = require("../helpers/checkIfUniqe")
const createError = require("../helpers/createError")
const decodeToken = require("../helpers/decodeToken")
const {
  noBookmarkFound,
  noBookmarks,
  noTagProvided,
  noMatchingRoutes,
  duplicateTags
} = require("../helpers/errorMessages")
const Bookmark = require("../models/bookmark")
const mongoose = require("mongoose")

module.exports = {
  //get all current bookmarks
  getBookmarks: async (req, res, next) => {
    // decode token here to get the ID from it
    const { user: userID } = await decodeToken(req.headers.token)

    if (!req.query.sortValue && !req.query.sortOrder) {
      // get all bookmarks as long as there's no query
      try {
        const bookmarkList = await Bookmark.find({ userID })
        res.locals.response = Object.assign({}, res.locals.response || {}, {
          bookmark: bookmarkList
        })
      } catch (error) {
        error.message = noBookmarks
        next(error)
      }
    }
    next()
  },

  getBookmarkByID: async (req, res, next) => {
    const { id } = req.params

    try {
      const foundBookmark = await Bookmark.findOne({ _id: id })
      res.locals.response = Object.assign({}, res.locals.response || {}, {
        bookmark: foundBookmark
      })
    } catch (error) {
      error.message = noBookmarkFound + id
      next(error)
    }
    next()
  },

  getBookmarkByTag: async (req, res, next) => {
    // TODO needs to be implemented with the personal bookmark approach
    try {
      const { tags } = req.query

      if (!tags) {
        createError(400, noTagProvided)
      }

      const searchArray = tags.split(",")
      const foundBookmarks = await Bookmark.find({ tag: { $all: searchArray } })
      res.locals.response = Object.assign({}, res.locals.response || {}, {
        bookmark: foundBookmarks
      })
    } catch (error) {
      next(error)
    }
    next()
  },

  //creates a new bookmark
  postBookmark: async (req, res, next) => {
    try {
      // decode token here to get the ID from it
      const { user: stringID } = await decodeToken(req.headers.token)

      const userID = mongoose.Types.ObjectId(stringID)
      const newBookmark = new Bookmark({ ...req.body, userID })

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
    try {
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
      const updatedBookmark = await Bookmark.findOneAndUpdate(
        { _id: id },
        updateBookmark,
        {
          runValidators: true,
          new: true
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

  sortBookmarks: async (req, res, next) => {
    // TODO needs to be implemented with the personal bookmark approach
    if (req.query.sortValue || req.query.sortOrder) {
      // sort bookmarks only of theres a query
      const sortOrder = req.query.sortOrder === "ASC" ? 1 : -1
      let sortedBookmarks
      try {
        sortedBookmarks =
          req.query.sortValue === "url"
            ? await Bookmark.aggregate([{ $sort: { url: sortOrder } }])
            : await Bookmark.aggregate([{ $sort: { createdAt: sortOrder } }])
        res.locals.response = Object.assign({}, res.locals.response || {}, {
          bookmark: sortedBookmarks
        })
      } catch (err) {
        next(err)
      }
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
