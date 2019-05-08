const mongoose = require("mongoose")

const { NODE_ENV } = process.env

const dbPaths = {
  development: "bookmarks",
  test: "bookmarks-test"
}

module.exports = {
  mongoose,
  connect: () => {
    mongoose.Promise = Promise
    return mongoose.connect("mongodb://localhost/" + dbPaths[NODE_ENV], {
      useNewUrlParser: true
    })
  },
  disconnect: done => {
    mongoose.disconnect(done)
  }
}
