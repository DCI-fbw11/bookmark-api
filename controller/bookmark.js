const db = require("../db")
const createError = require("../tools/createError")
const { noBookmarkFound, noIDDefined } = require("../tools/errorMessages")
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

    const bookmark = db
      .get("bookmarks")
      .find({ id })
      .value()

    if (!bookmark) {
      createError(400, noBookmarkFound)
    }

    res.locals.response = Object.assign({}, res.locals.response || {}, {
      bookmark
    })

    next()
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
    const { bookmark } = Bookmark.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })

    if (!bookmark)
      return res
        .status(404)
        .send("The bookmark with the given ID was not found.")

    res.locals.response = Object.assign({}, res.locals.response || {}, {
      bookmark: bookmark
    })

    next()
  },

  deleteBookmarkById: (req, res, next) => {
    const { id } = req.params

    const bookmark = db
      .get("bookmarks")
      .find({ id })
      .value()

    if (!bookmark) {
      createError(400, noBookmarkFound)
    } else {
      db.get("bookmarks")
        .remove({ id })
        .write()

      res.locals.response = Object.assign({}, res.locals.response || {}, {
        message: `bookmark with id: ${id} is removed...`
      })
      next()
    }
  },

  badRequest: (req, res, next) => {
    createError(400, noIDDefined)
    next()
  }
}
