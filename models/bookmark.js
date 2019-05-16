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
    type: [{ type: String, maxlength: 50 }]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date
  },
  userID: {
    type: Schema.Types.ObjectId,
    required: true
  }
})

const Bookmark = mongoose.model("Bookmark", BookmarkSchema)
module.exports = Bookmark
