const express = require("express")
const apiRouter = express.Router({ strict: true })

// Middleware
const { apiErrorMiddleware } = require("../middleware/api")
const { checkURL, checkBody } = require("../middleware/validation")
const checkToken = require("../middleware/checkToken")

//Helper
const sendJsonResp = require("../helpers/sendJsonResp")

// Controller
const {
  getBookmarks,
  getBookmarkByID,
  getBookmarkByDateRange,
  postBookmark,
  updateBookmarkById,
  deleteBookmarkById,
  sortBookmarks,
  batchDeleteBookmarks,
  noMatch
} = require("../controller/bookmark")

// Route Config
const apiRoutes = {
  getAllBookmarks: "/bookmarks",
  getBookmarkByID: "/bookmarks/:id",
  getBookmarkByDateRange: "/bookmarks/date/:daterange",
  postBookmark: "/bookmarks",
  updateBookmarkById: "/bookmarks/:id",
  deleteBookmarkById: "/bookmarks/:id",
  batchDeleteBookmarks: "/bookmarks/delete/",
  all: "*"
}

// To show our api users what is possible we can show all endpoints at home route (/)
apiRouter.get("/", (req, res) => {
  res.json({ availableRoutes: apiRoutes })
})

// Protected Route Token Check
apiRouter.all(apiRoutes.all, checkToken)

// GET
apiRouter.get(apiRoutes.getAllBookmarks, getBookmarks, sortBookmarks)
apiRouter.get(apiRoutes.getBookmarkByID, getBookmarkByID)
apiRouter.get(apiRoutes.getBookmarkByDateRange, getBookmarkByDateRange)

// POST
apiRouter.post(apiRoutes.postBookmark, checkBody, checkURL, postBookmark)

// UPDATE
apiRouter.put(
  apiRoutes.updateBookmarkById,
  checkBody,
  checkURL,
  updateBookmarkById
)

// DELETE
apiRouter.delete(apiRoutes.deleteBookmarkById, deleteBookmarkById)

// Batch Delete Bookmarks with an Array of ID's
apiRouter.delete(apiRoutes.batchDeleteBookmarks, batchDeleteBookmarks)

// No match Route
apiRouter.all(apiRoutes.all, noMatch)

// The middleware that actually sends the response
apiRouter.use(sendJsonResp)

// Custom error handler
apiRouter.use(apiErrorMiddleware)

module.exports = { apiRouter, apiRoutes }
