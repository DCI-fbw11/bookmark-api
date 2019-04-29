const mongoose = require("mongoose")
const { Schema } = mongoose

const TagSchema = new Schema({
  title: {
    type: String,
    maxlength: 50,
    required: true
  },
  bookmarks: [
    {
      type: ObjectId
    }
  ]
})

const Tag = mongoose.model("Tag", TagSchema)
module.exports = Tag
