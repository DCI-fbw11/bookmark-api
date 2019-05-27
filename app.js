require("dotenv").config()
const express = require("express")
const logger = require("morgan")
const chalk = require("chalk")

const { connect } = require("./db/connection")
const { apiRouter } = require("./routes/bookmarks")
const { authRouter } = require("./routes/auth")
const { docsRouter } = require("./routes/docs")
const { usersRouter } = require("./routes/users")
const app = express()

connect()
  .then(() => {
    console.log(chalk.green("Connected to Mongo")) // eslint-disable-line no-console
  })
  .catch(error => {
    console.error(chalk.red("Could not connect, ", error)) // eslint-disable-line no-console
  })

app.use(logger("dev"))
app.use(express.json())
app.use("/api", apiRouter)
app.use("/auth", authRouter)
app.use("/admin", usersRouter)

// Docs
app.use("/", docsRouter)

module.exports = app
