const express = require("express")
const docsRouter = express.Router()
const path = require("path")

// @route   GET /
// @desc    Shows temp docs created from DOCS.MD
// @access  Public
docsRouter.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "../../docs/docs.html"))
})

module.exports = { docsRouter }
