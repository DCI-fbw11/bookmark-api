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
const dateParser = require("../helpers/dateParser")
const mongoose = require("mongoose")

module.exports = {
  // @route   GET api/bookmarks
  // @desc    Get all bookmarks
  // @access  Private
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

  // @route   GET api/bookmarks/:id
  // @desc    Get one bookmark by ID
  // @access  Private
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

  // @route   GET api/bookmarks/tag/?tags=<search string>,<search string>
  // @desc    Search bookmarks by tag
  // @access  Private
  getBookmarkByTag: async (req, res, next) => {
    try {
      const { tags } = req.query
      const { user: stringID } = await decodeToken(req.headers.token)

      const userID = mongoose.Types.ObjectId(stringID)

      if (!tags) {
        createError(400, noTagProvided)
      }

      const searchArray = tags.split(",")
      const foundBookmarks = await Bookmark.find({
        userID,
        tag: { $all: searchArray }
      })
      res.locals.response = Object.assign({}, res.locals.response || {}, {
        bookmark: foundBookmarks
      })
    } catch (error) {
      next(error)
    }
    next()
  },
  // @route   GET date api/bookmarks/dates/?startDate=2018.12.01
  // @route   GET date range api/bookmarks/dates/?startDate=2018.12.01&endDate=2019.05.15
  // @desc    Search bookmarks by date or dates
  // @access  Private

  getBookmarkByDateRange: async (req, res, next) => {
    const { startDate, endDate } = req.query
    // you can find more notes in dateParser.js
    const { parsedStart, parsedEnd } = dateParser(startDate, endDate)
    //  this contains the list of bookmarks
    let foundBookmarks
    try {
      // if date range is provided this runs
      if (parsedStart !== parsedEnd) {
        foundBookmarks = await Bookmark.find({
          createdAt: {
            $gte: new Date(parsedStart),
            $lt: new Date(parsedEnd)
          }
        })
        //if only one date provided this runs
      } else {
        const end = new Date(parsedEnd).setHours(23, 59, 59, 999)
        foundBookmarks = await Bookmark.find({
          createdAt: {
            $gte: new Date(parsedStart),
            $lt: end
          }
        })
      }
      res.locals.response = Object.assign({}, res.locals.response || {}, {
        bookmark: foundBookmarks
      })
    } catch (err) {
      next(err)
    }
    next()
  },

  // @route   POST api/bookmarks
  // @desc    Create a new bookmark
  // @access  Private
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

  // @route   PUT api/bookmarks/:id
  // @desc    Update one bookmark by ID
  // @access  Private
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

  // @route   DELETE api/bookmarks/:id
  // @desc    Delete one bookmark by ID
  // @access  Private
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

  // @route   GET api/bookmarks?sortOrder=<string>&sortValue=<string>
  // @desc    Get and sort all bookmarks
  // @access  Private
  sortBookmarks: async (req, res, next) => {
    if (req.query.sortValue || req.query.sortOrder) {
      try {
        // sort bookmarks only of theres a query
        const order = req.query.sortOrder || "ASC"
        const sortOrder = order === "ASC" ? 1 : -1

        let sortedBookmarks

        const { user: stringID } = await decodeToken(req.headers.token)
        const userID = mongoose.Types.ObjectId(stringID)

        sortedBookmarks =
          req.query.sortValue === "url"
            ? await Bookmark.find({ userID }).sort({ url: sortOrder })
            : req.query.sortValue === "title"
            ? await Bookmark.find({ userID }).sort({ title: sortOrder })
            : await Bookmark.find({ userID }).sort({ createdAt: sortOrder })

        res.locals.response = Object.assign({}, res.locals.response || {}, {
          bookmark: sortedBookmarks
        })
      } catch (error) {
        next(error)
      }
    }
    next()
  },

  // @route   DELETE api/bookmarks/delete/
  // @desc    Delete the bookmarks that match the passed in array of bookmark IDs
  // @access  Private
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

  // @route   N/A
  // @desc    Non matching route
  // @access  Private
  noMatch: (req, res, next) => {
    if (res.locals.response) {
      next()
    } else {
      createError(404, noMatchingRoutes)
      next()
    }
  }
}
