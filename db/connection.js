const mongoose = require("mongoose")
mongoose.set("useCreateIndex", true)
const { NODE_ENV } = process.env

const dbPaths = {
  development: "bookmarks",
  test: "bookmarks-test"
}

module.exports = {
  mongoose,
  connect: () => {
    mongoose.Promise = Promise
    return mongoose.connect("mongodb://127.0.0.1/" + dbPaths[NODE_ENV], {
      useNewUrlParser: true
    })
  },
  disconnect: done => {
    mongoose.disconnect(done)
  }
}
