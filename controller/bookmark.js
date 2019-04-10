const db = require("../db");
const uuidv1 = require("uuid/v1");

module.exports = {
  getBookmarks: (req, res, next) => {
    res.locals.response = Object.assign({}, res.locals.response || {}, {
      bookmark: db.get("bookmarks").value()
    });

    next();
  },

  getBookmarkByID: (req, res, next) => {
    const { id } = req.params;

    if (!id) {
      throw new Error("No ID defined, bookmarks/:id");
    }

    const bookmark = db
      .get("bookmarks")
      .find({ id })
      .value();

    if (!bookmark) {
      throw new Error("No bookmark found for id");
    }

    res.locals.response = Object.assign({}, res.locals.response || {}, {
      bookmark
    });

    next();
  },

  postBookmark: (req, res, next) => {
    const { url, tags } = req.body;

    if (!url) {
      throw new Error("No url to bookmark defined");
    }

    const newBookmark = { id: uuidv1(), url: url, createdAt: Date.now(), tags };
    db.get("bookmarks")
      .push(newBookmark)
      .write();

    res.locals.response = Object.assign({}, res.locals.response || {}, {
      bookmark: newBookmark
    });

    next();
  },

  deleteBookmark: (req, res, next) => {
    const { id } = req.params;
    const bookmark = db
      .get("bookmarks")

      .remove({ id: id })
      .write();

    res.locals.response = Object.assign({}, res.locals.response || {}, {
      bookmark
    });
    next();
  }
};
