const express = require("express")
const logger = require("morgan")

const { connect } = require("./db/connection")
const { apiRouter } = require("./routes/api")
const app = express()

connect()
  .then(() => {
    console.log("Connected to Mongo")
  })
  .catch(err => {
    console.error("Could not connect, ", err)
  })

app.use(logger("dev"))
app.use(express.json())
app.use("/api", apiRouter)

module.exports = { app }
