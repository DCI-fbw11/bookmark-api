const mongoose = require("mongoose")
const { Schema } = mongoose

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ["admin", "user"]
  }
})

const User = mongoose.model("User", UserSchema)
module.exports = User
