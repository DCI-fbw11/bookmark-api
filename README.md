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

# GET

## getBookmarks

The _/bookmarks_ route will show all the bookmarks in the database


![all_success](https://user-images.githubusercontent.com/44833666/57297961-446d4b80-70d1-11e9-9ca9-b30f2ecb9d4a.png)

If an Error should occur the following message will show up

![all_error](https://user-images.githubusercontent.com/44833666/57298353-45eb4380-70d2-11e9-9229-01cde10990dd.png)

## getBookmarkByID

To see a specific bookmark, the ID is needed and can be added like this : _/bookmarks/the id of the bookmark you are looking for_

# POST

## postBookmark

To add a bookmark to the database use the /bookmarks route. A **url** must be given as it is required. Titel, short description and tags a optional

# PUT

## updateBookmarkByID

To update a bookmark the key, an updated value and the ID of the bookmark you want to update is needed

# DELETE

## deleteBookmarkByID

Provide the id of the bookmark you want to delete.

> **ProTip:** The routes a stric wich means that a **"/"** at the **end** of a route will throw an error if
