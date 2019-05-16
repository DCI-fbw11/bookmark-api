const express = require("express")
const docsRouter = express.Router()
const path = require("path")

/* GET home page. */
docsRouter.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "../../docs/docs.html"))
})

module.exports = { docsRouter }
