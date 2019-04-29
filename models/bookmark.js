const mongoose = require("mongoose")
const { Schema } = mongoose

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
    type: [String],
    unique: true,
    validate: v => v == null || v.length > 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

const Bookmark = mongoose.model("Bookmark", BookmarkSchema)
module.exports = Bookmark
