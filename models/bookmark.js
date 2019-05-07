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
    validate: {
      validator: v => v && v.length > 0,
      message: "You must provide at least 1 tag."
    }
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

const Bookmark = mongoose.model("Bookmark", BookmarkSchema)
module.exports = Bookmark
