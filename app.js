const express = require("express")
const logger = require("morgan")

const PORT = process.env.PORT || 3000

const indexRouter = require("./routes/index")
const apiRoutes = require("./routes/api")

const app = express()

app.use(logger("dev"))
app.use(express.json())

app.use("/", indexRouter)
app.use("/api", apiRoutes)

app.listen(PORT, console.log("Server is listening on port:", PORT))
