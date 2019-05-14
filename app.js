const express = require("express")
const logger = require("morgan")

const { connect, mongoose } = require("./db/connection")
const { apiRouter } = require("./routes/api")
const { authRouter } = require("./routes/auth")
const app = express()

const run = async () => {
  await mongoose.connection.on("connected", () => Promise.resolve())
  console.log("Connected to Mongo")
  app.use(logger("dev"))
  app.use(express.json())
  app.use("/api", apiRouter)
  app.use("/auth", authRouter)
}

try {
  connect()
  run()
} catch (error) {
  console.error("Could not connect, ", error)
}

module.exports = app
