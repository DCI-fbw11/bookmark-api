const express = require("express")
const logger = require("morgan")
const mongoose = require("mongoose")

const PORT = process.env.PORT || 4000

const indexRouter = require("./routes/index")
const apiRoutes = require("./routes/api")

const app = express()

mongoose.connect("mongodb://localhost/bookmarks", {
  useNewUrlParser: true
})
.then(() => {
  console.log("Connected to Mongo")
})
.catch((err) => {
  console.error("Could not connect, ", err)
})

app.use(logger("dev"))
app.use(express.json())

app.use("/", indexRouter)
app.use("/api", apiRoutes)

app.listen(PORT, console.log("Server is listening on port:", PORT))
