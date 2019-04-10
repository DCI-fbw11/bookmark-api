const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")

const adapter = new FileSync("./db/db.json")
const db = low(adapter)

// Set some defaults
db.defaults({
  bookmarks: [
    {
      id: "kmnbvfdr567uikjhbgf",
      url: "https://twitter.com/iamdevloper/status/1112428799222788099",
      tags: ["humor", "sad reality"],
      createdAt: Date.now()
    }
  ]
}).write()

module.exports = db
