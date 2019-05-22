const Bookmark = require("../models/bookmark")

const cleanUpAfterUserDeletion = async userID => {
  try {
    await Bookmark.deleteMany({ userID })
    return true
  } catch (error) {
    return error
  }
}

module.exports = cleanUpAfterUserDeletion
