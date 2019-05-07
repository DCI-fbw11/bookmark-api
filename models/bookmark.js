const mongoose = require("mongoose")
const { Schema } = mongoose
const arrayUniquePlugin = require("mongoose-unique-array")

const BookmarkSchema = new Schema({
  title: {
    type: String,
    maxlength: 50,
    default: "No title"
  },
  shortDescription: {
    type: String,
    maxlength: 150,
    default: ""
  },
  url: {
    type: String,
    required: true
  },
  tag: {
    type: [{ type: String, maxlength: 50, unique: true }]
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date
  }
})

const Bookmark = mongoose.model("Bookmark", BookmarkSchema)
BookmarkSchema.plugin(arrayUniquePlugin)
module.exports = Bookmark
