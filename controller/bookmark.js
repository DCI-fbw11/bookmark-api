const db = require("../db")
const createError = require("../helpers/createError")
const { noBookmarkFound, noIDDefined } = require("../helpers/errorMessages")
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
    const updateBookmark = req.body
    console.log(req.params)
    if (!id)
      return res
        .status(404)
        .send("The bookmark with the given ID was not found.")

    Bookmark.updateOne({ _id: id }, updateBookmark, { new: true })
      .then(updatedBookmark => {
        res.locals.response = Object.assign({}, res.locals.response || {}, {
          bookmark: updatedBookmark
        })
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        next()
      })
  },

  /*====================================================*

  *    PUT REQUEST TO http://localhost:4000/api/bookmarks/5cc56589f2d7821759d5ad45

      {
	
	      "title": "Boomark Title",
	      "shortDescription": "Bookmark shortdescription",
	      "url": "yahoo.com",
	      "tag": ["fistTag", "secondtag"]


      }
  *
  *    UPDATE BOOKMARK BY ID
  */

  //  updateBookmarkById: async (req, res) => {
  //   const { bookmarkId } = req.params
  //   const updateBookmark = req.body

  //   try {
  //     await Bookmark.updateOne({_id: bookmarkId}, updateBookmark, { new:true })
  //     res.locals.response = Object.assign({}, res.locals.response || {}, {
  //     bookmark: res.status(200).json({msg: `Bookmark with the id ${bookmarkId} is updated`})
  //   })
  //   } catch (err) {
  //     console.error(err)
  //   }
  //   finally(){
  //     return next()
  //   }

  // },
  /*====================================================*/

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
