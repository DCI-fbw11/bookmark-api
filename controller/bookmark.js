const db = require("../db")

const createError = require("../helpers/createError")
const { noBookmarkFound, noIDDefined } = require("../helpers/errorMessages")
const Bookmark = require("../models/bookmark")

module.exports = {
  getBookmarks: (req, res, next) => {
    const { body } = req
    console.log(body)
    res.locals.response = Object.assign({}, res.locals.response || {}, {
      bookmark: body
    })

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
      .catch(err => console.error(err))
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
        console.error(err)
      })
      .finally(() => {
        next()
      })
  },

  updateBookmarkById: (req, res, next) => {
    const { id } = req.params
    const updateBookmark = req.body

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