const mongoose = require("mongoose")
mongoose.set("useCreateIndex", true)
const { NODE_ENV, DB_PROD_USER, DB_PROD_PASSWORD } = process.env

const dbPaths = {
  development: "bookmarks",
  test: "bookmarks-test",
  production: "bookmark-api-prod"
}

let connectionString

if (NODE_ENV === "production") {
  connectionString = `mongodb+srv://${DB_PROD_USER}:${DB_PROD_PASSWORD}@cluster0-u0h0i.mongodb.net/test?retryWrites=true`
} else {
  connectionString = "mongodb://127.0.0.1/"
}

module.exports = {
  mongoose,
  connect: () => {
    mongoose.Promise = Promise
    return mongoose.connect(connectionString + dbPaths[NODE_ENV], {
      useNewUrlParser: true
    })
  },
  disconnect: done => {
    mongoose.disconnect(done)
  }
}
