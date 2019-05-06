const express = require("express")
const { check } = require("express-validator/check")
const router = express.Router({ strict: true })

// Middleware
const { apiErrorMiddleware } = require("../middleware/api")

//Helper
const sendJsonResp = require("../helpers/sendJsonResp")

// Controller
const {
  getBookmarks,
  getBookmarkByID,
  postBookmark,
  badRequest,
  updateBookmarkById,
  deleteBookmarkById
} = require("../controller/bookmark")

const { createTag } = require("../controller/tag")

// Route Config
const apiRoutes = {
  getAllBookmarks: "/bookmarks",
  getBookmarkByID: "/bookmarks/:id",
  postBookmark: "/bookmarks",
  updateBookmarkById: "/bookmarks/:id",
  deleteBookmarkById: "/bookmarks/:id",
  falseRoute: "/bookmarks/",
  createTag: "/tags"
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
router.post(apiRoutes.postBookmark, [check("url").isUrl()], postBookmark)
router.post(apiRoutes.createTag, createTag)

// UPDATE
router.put(apiRoutes.updateBookmarkById, updateBookmarkById)

// DELETE
router.delete(apiRoutes.deleteBookmarkById, deleteBookmarkById)

// The middleware that actually sends the response
router.use(sendJsonResp)

// Custom error handler
router.use(apiErrorMiddleware)

module.exports = router
