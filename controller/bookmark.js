const db = require("../db")

const createError = require("../helpers/createError")
const {
  noBookmarkFound,
  noIDDefined,
  noURLDefined
} = require("../helpers/errorMessages")
const Bookmark = require("../models/bookmark")

module.exports = {
  getBookmarks: (req, res, next) => {
    res.locals.response = Object.assign({}, res.locals.response || {}, {
      bookmark: db.get("bookmarks").value()
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
    const { url, tags } = req.body

    if (!url) {
      createError(406, noURLDefined)
    }

    const bookmark = db
      .get("bookmarks")
      .find({ id })
      .value()

    if (!bookmark) {
      createError(400, noBookmarkFound)
    } else {
      const updatedBookmark = db
        .get("bookmarks")
        .find({ id })
        .assign({ url }, { tags })
        .write()

      res.locals.response = Object.assign({}, res.locals.response || {}, {
        updatedBookmark
      })
    }

    next()
  },

  deleteBookmarkById: (req, res, next) => {
    const { bookmark } = Bookmark.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })

    if (!bookmark)
    const { id } = req.params
    const deleteBookmark= req.body
    console.log(req.params)
    if (!id)
      return res
        .status(404)
        .send("The bookmark with the given ID was not found.")
    
    
      res.locals.response = Object.assign({}, res.locals.response || {}, {
        bookmark: bookmark
      })
      next()
      Bookmark.deleteOne({ _id: id }, deleteBookmark, { new: true })
      .then(deleteBookmark => {
        res.locals.response = Object.assign({}, res.locals.response || {}, {
          bookmark: deleteBookmark
        })
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        next()
      })

    }
  },

  badRequest: (req, res, next) => {
    createError(400, noIDDefined)
    next()
  }

