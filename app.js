const express = require("express")
const logger = require("morgan")
const mongoose = require("mongoose")

const PORT = process.env.PORT || 4000

//const indexRouter = require("./routes/index")
const apiRoutes = require("./routes/api")

const app = express()

<<<<<<< HEAD
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
=======
mongoose.connect("mongodb://localhost/bookmarks", {
  useNewUrlParser: true
})
.then(() => {
  console.log("Connected to Mongo")
})
.catch((err) => {
  console.error("Could not connect, ", err)
})
>>>>>>> f5d807e960c139c0ea602cbe28981d480e6b28c1

app.use(logger("dev"))
app.use(express.json())

// app.use("/", indexRouter)
app.use("/api", apiRoutes)

app.listen(PORT, console.log("Server is listening on port:", PORT))
