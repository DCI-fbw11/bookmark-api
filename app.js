const express = require("express")
const logger = require("morgan")
const mongoose = require("mongoose")

const { apiRouter } = require("./routes/api")
const app = express()

console.log(process.env.NODE_ENV)

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
app.use("/api", apiRouter)

module.exports = app
