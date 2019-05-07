# Bookmark Api

## Objectives

```js
//GET api/bookmarks
[
  {
    id: "<uuid>",
    url: 'https://twitter.com/iamdevloper/status/1112428799222788099',
    tag: ['humor', 'sad reality'],
    createdAt: "<Date>"
  },
  {
    ...
  }
]
```

- use lowDB
  - set some defaults, ok!
- implement as mentioned above api/bookmarks where `/api` is controlled by a middleware
- create directories for:
  - routes
  - controller
  - database (lowDB)

### Endpoints

> Read about [Route parameters](https://expressjs.com/en/guide/routing.html#route-parameters)

- GET
  - api/bookmarks
  - api/bookmarks/:id
- POST
  - api/bookmarks
- PUT
  - api/bookmarks/:id
- DELETE
  - api/bookmarks/:id

# API Documentation

This will show you the expected **input** for each **endpoint** and the **value** it returns

# GET ALL ROUTES

To see all available routes, use the `/api` endpoint.

![all_success](https://user-images.githubusercontent.com/44833666/57297961-446d4b80-70d1-11e9-9ca9-b30f2ecb9d4a.png)

# GET

## getAllBookmarks

The endpoint `/api/bookmarks` will show all bookmarks in the database

If an **error** occurs the following message will be displayed

![all_error](https://user-images.githubusercontent.com/44833666/57298353-45eb4380-70d2-11e9-9229-01cde10990dd.png)

## getBookmarkByID

To see a specific bookmark, the ID is required and can be added in the following way : `/api/bookmarks/:id`.

# POST

## postBookmark

To add a bookmark to the database, use the `/api/bookmarks` endpoint. A **url** is required; titel, short description and tags are optional.

# PUT

## updateBookmarkByID

To update a bookmark in the database, use the `/api/bookmarks` endpoint. To update a bookmark, the bookmark ID, the key and the updated valueare required.

# DELETE

## deleteBookmarkByID

Provide the id of the bookmark you want to delete to the `/api/bookmarks/:id` endpoint.

> **ProTip:** The routes a strict, which means that a **"/"** at the **end** of a route will throw an error.
