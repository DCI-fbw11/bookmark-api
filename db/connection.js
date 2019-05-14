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
  connectionString = `mongodb://${DB_PROD_USER}:${DB_PROD_PASSWORD}@cluster0-shard-00-00-u0h0i.mongodb.net:27017,cluster0-shard-00-01-u0h0i.mongodb.net:27017,cluster0-shard-00-02-u0h0i.mongodb.net:27017/test?replicaSet=Cluster0-shard-0&ssl=true&authSource=admin`
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
