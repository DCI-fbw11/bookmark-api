const express = require("express");
const router = express.Router();

// Middleware
const { apiErrorMiddleware } = require("../middleware/api");

//Helper
const { sendJsonResp } = require("../helper");

// Controller
const {
  getBookmarks,
  getBookmarkByID,
  postBookmark,
  updateBookmarkById,
  deleteBookmarkById
} = require("../controller/bookmark");

// Route Config
const apiRoutes = {
  allBookmarks: "/bookmarks",
  bookmarkByID: "/bookmarks/:id",
  postBookmark: "/bookmarks",
  updateBookmarkById: "/bookmarks/:id",
  deleteBookmarkById: "/bookmarks/:id"
};

// To show our api users what is possible we can show all endpoints at home route (/)
router.get("/", (req, res) => {
  res.json({ availableRoutes: Object.values(apiRoutes) });
});

// GET
router.get(apiRoutes.allBookmarks, getBookmarks);
router.get(apiRoutes.bookmarkByID, getBookmarkByID);

// POST
router.post(apiRoutes.postBookmark, postBookmark);

// UPDATE
router.put(apiRoutes.updateBookmarkById, updateBookmarkById);

// DELETE
router.delete(apiRoutes.deleteBookmarkById, deleteBookmarkById);

// The middleware that actually sends the response
router.use(sendJsonResp);

// Custom error handler
router.use(apiErrorMiddleware);

module.exports = router;
