const db = require("../db");
const uuidv1 = require("uuid/v1");

module.exports = {
  getBookmarks: (req, res, next) => {
    res.locals.response = Object.assign({}, res.locals.response || {}, {
      bookmark: db.get("bookmarks").value()
    });

    next();
  },

  sortBookmarks: (req, res, next) => {
    res.locals.response = Object.assign({}, res.locals.response || {}, {
      bookmark: db.get("bookmarks").value()
    });

    const { sortValue = "ASC", sortOrder = "createdAt" } = req.query;
    const bookmarks = res.locals.response.bookmark;

    let sort;

    if (sortValue === "url") {
      sort = bookmarks.sort((a, b) => {
        if (sortOrder === "ASC") {
          return a.url.toLowerCase() > b.url.toLowerCase() ? 1 : -1;
        } else if (sortOrder === "DESC") {
          return a.url.toLowerCase() > b.url.toLowerCase() ? -1 : 1;
        }
        return 0;
      });
    } else {
      sort = bookmarks.sort((a, b) => {
        if (sortOrder === "ASC") {
          return b.createdAt - a.createdAt;
        } else if (sortOrder === "DESC") {
          return a.createdAt - b.createdAt;
        }
      });
    }

    res.locals.response = Object.assign({}, res.locals.response || {}, {
      bookmark: sort
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
    console.log(req.body);
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

  updateBookmarkById: (req, res, next) => {
    const { id } = req.params;
    const { url, tags } = req.body;

    if (!id) {
      throw new Error("No ID defined, bookmarks/:id");
    }

    const bookmark = db
      .get("bookmarks")
      .find({ id })
      .assign({ url }, { tags })
      .write();

    res.locals.response = Object.assign({}, res.locals.response || {}, {
      bookmark
    });

    next();
  },

  deleteBookmarkById: (req, res, next) => {
    const { id } = req.params;

    if (!id) {
      throw new Error("No ID defined, bookmarks/:id");
    }
    db.get("bookmarks")
      .remove({ id })
      .write();

    res.locals.response = Object.assign({}, res.locals.response || {}, {
      message: `bookmark with id: ${id} is removed...`
    });
    next();
  }
};
