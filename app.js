const express = require("express")
const logger = require("morgan")
// Docs
const swaggerUi = require("swagger-ui-express")
const swaggerJSDoc = require("swagger-jsdoc")

// const swaggerDocument = require('./swagger.json')

const options = {
  definition: {
    info: {
      title: "Hello World", // Title (required)
      version: "1.0.0", // Version (required)
    },
  },
  // Path to the API docs
  apis: ["./routes/*.js"],
}

const swaggerSpec = swaggerJSDoc(options)
 


const { connect } = require("./db/connection")
const { apiRouter } = require("./routes/api")
const { authRouter } = require("./routes/auth")
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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

module.exports = { app }
