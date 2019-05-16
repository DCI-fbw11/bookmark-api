const express = require("express")
const logger = require("morgan")
// Docs
const swaggerUi = require("swagger-ui-express")
const swaggerJSDoc = require("swagger-jsdoc")
const { version } = require("./package.json")

const options = {
  definition: {
    info: {
      title: "Bookmarks API",
      version
    }
  },
  // Path to the API docs
  apis: ["./routes/*.js"]
}

const { connect } = require("./db/connection")
const { apiRouter } = require("./routes/api")
const { authRouter } = require("./routes/auth")
const path = require("path")
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
app.use("/auth", authRouter)

// Docs
const swaggerSpec = swaggerJSDoc(options)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/docs.html"))
})

module.exports = app
