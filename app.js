const express = require("express")
const logger = require("morgan")
const mongoose = require("mongoose")

const apiRoutes = require("./routes/api")
const app = express()

mongoose
  .connect("mongodb://localhost/bookmarks", {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Connected to Mongo")
  })
  .catch(err => {
    console.error("Could not connect, ", err)
  })

app.use(logger("dev"))
app.use(express.json())
app.use("/api", apiRoutes)

module.exports = app
