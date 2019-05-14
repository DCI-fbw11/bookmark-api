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
  postBookmark,
  updateBookmarkById,
  deleteBookmarkById,
  batchDeleteBookmarks,
  noMatch
} = require("../controller/bookmark")

// Route Config
const apiRoutes = {
  getAllBookmarks: "/bookmarks",
  getBookmarkByID: "/bookmarks/:id",
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
/**
 * @swagger
 *
 * definitions:
 *   Bookmark:
 *     type: object
 *     required:
 *       - title
 *       - url
 *     properties:
 *       title:
 *         type: string
 *       shortDescription:
 *         type: string
 *       url:
 *         type: string
 *         format: url
 *       tag:
 *         type: array
 *         items:
 *           type: string
 *       createdAt:
 *         type: string
 *       updatedAt:
 *         type: string
 */

/**
 * @swagger
 *
 * /api/bookmarks:
 *   get:
 *     description: List of bookmarks
 *     parameters:
 *       -
 *        name: token
 *        in: header
 *        type: string
 *        required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: bookmarks
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Bookmark'
 */
apiRouter.get(apiRoutes.getAllBookmarks, getBookmarks)

/**
 * @swagger
 *
 * /api/bookmarks/{id} :
 *   get:
 *     description: Receive one specific bookmark by ID
 *     parameters:
 *       -
 *        in: header
 *        name: token
 *        required: true
 *        type: string
 *       -
 *        description: ID of the bookmark you want to get
 *        in: path
 *        name: id
 *        required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: bookmark
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Bookmark'
 */
apiRouter.get(apiRoutes.getBookmarkByID, getBookmarkByID)

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
