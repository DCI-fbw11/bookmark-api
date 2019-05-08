const express = require("express")
const apiRouter = express.Router({ strict: true })

// Middleware
const { apiErrorMiddleware, isBodyValid } = require("../middleware/api")

//Helper
const sendJsonResp = require("../helpers/sendJsonResp")

// Controller
const {
  getBookmarks,
  getBookmarkByID,
  postBookmark,
  badRequest,
  updateBookmarkById,
  deleteBookmarkById,
  batchDeleteBookmarks
} = require("../controller/bookmark")

// Route Config
const apiRoutes = {
  getAllBookmarks: "/bookmarks",
  getBookmarkByID: "/bookmarks/:id",
  postBookmark: "/bookmarks",
  updateBookmarkById: "/bookmarks/:id",
  deleteBookmarkById: "/bookmarks/:id",
  batchDeleteBookmarks: "/bookmarks/delete/",
  falseRoute: "/bookmarks/"
}

// To show our api users what is possible we can show all endpoints at home route (/)
apiRouter.get("/", (req, res) => {
  res.json({ availableRoutes: apiRoutes })
})

// Bad Request Route
apiRouter.all(apiRoutes.falseRoute, badRequest)

// GET
apiRouter.get(apiRoutes.getAllBookmarks, getBookmarks)
apiRouter.get(apiRoutes.getBookmarkByID, getBookmarkByID)

// POST
apiRouter.post(apiRoutes.postBookmark, isBodyValid, postBookmark)

// UPDATE
apiRouter.put(apiRoutes.updateBookmarkById, isBodyValid, updateBookmarkById)

// DELETE
apiRouter.delete(apiRoutes.deleteBookmarkById, deleteBookmarkById)

// Batch Delete Bookmarks with an Array of ID's
apiRouter.delete(apiRoutes.batchDeleteBookmarks, batchDeleteBookmarks)

// The middleware that actually sends the response
apiRouter.use(sendJsonResp)

// Custom error handler
apiRouter.use(apiErrorMiddleware)

module.exports = { apiRouter, apiRoutes }
