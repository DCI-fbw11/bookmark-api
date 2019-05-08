const express = require("express")
const router = express.Router({ strict: true })
// const { validURL } = require("../middleware/validation")
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
router.get("/", (req, res) => {
  res.json({ availableRoutes: apiRoutes })
})

// Bad Request Route
router.all(apiRoutes.falseRoute, badRequest)

// GET
router.get(apiRoutes.getAllBookmarks, getBookmarks)
router.get(apiRoutes.getBookmarkByID, getBookmarkByID)

// POST
router.post(apiRoutes.postBookmark, isBodyValid, postBookmark)

// UPDATE

router.put(
  apiRoutes.updateBookmarkById,
  [check("url").isURL()],
  updateBookmarkById
)

// DELETE
router.delete(apiRoutes.deleteBookmarkById, deleteBookmarkById)

// Batch Delete Bookmarks with an Array of ID's
router.delete(apiRoutes.batchDeleteBookmarks, batchDeleteBookmarks)

// The middleware that actually sends the response
router.use(sendJsonResp)

// Custom error handler
router.use(apiErrorMiddleware)

module.exports = router
