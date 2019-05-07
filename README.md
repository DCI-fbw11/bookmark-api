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

![all_success](https://user-images.githubusercontent.com/44833666/57299736-a5971e00-70d5-11e9-99b7-8723f285f7cc.png)

If an **error** occurs the following message will be displayed

![all_error](https://user-images.githubusercontent.com/44833666/57298353-45eb4380-70d2-11e9-9229-01cde10990dd.png)

## getBookmarkByID

To see a specific bookmark, the ID is required and can be added in the following way : `/api/bookmarks/:id`.

![success_by_id](https://user-images.githubusercontent.com/44833666/57299768-b6479400-70d5-11e9-809c-0ae829f4c74f.png)

If an **error** occurs the following message will be displayed

![error_by_id](https://user-images.githubusercontent.com/44833666/57299793-cc555480-70d5-11e9-8fd6-21ffc7f07723.png)

# POST

## postBookmark

To add a bookmark to the database, use the `/api/bookmarks` endpoint. A **url** is required; titel, short description and tags are optional.

![success_post](https://user-images.githubusercontent.com/44833666/57299804-d24b3580-70d5-11e9-8732-ea95d0c9968f.png)

If an **error** occurs the following message will be displayed

![error_post](https://user-images.githubusercontent.com/44833666/57299806-d5debc80-70d5-11e9-93d8-e28ee1e29a36.png)

# PUT

## updateBookmarkByID

To update a bookmark in the database, use the `/api/bookmarks` endpoint. To update a bookmark, the bookmark ID, the key and the updated valueare required.

![success_update](https://user-images.githubusercontent.com/44833666/57299823-dbd49d80-70d5-11e9-8549-1f73f893d03a.png)

If an **error** occurs the following message will be displayed

![error_update](https://user-images.githubusercontent.com/44833666/57299837-df682480-70d5-11e9-9183-95a253fe81af.png)

# DELETE

## deleteBookmarkByID

Provide the id of the bookmark you want to delete to the `/api/bookmarks/:id` endpoint.

![success_delete](https://user-images.githubusercontent.com/44833666/57299855-e5f69c00-70d5-11e9-8dcf-009d8aa2ccd1.png)

If an **error** occurs the following message will be displayed

![error_delete](https://user-images.githubusercontent.com/44833666/57299867-e98a2300-70d5-11e9-940e-ef0b24a13a6c.png)

> **ProTip:** The routes a strict, which means that a **"/"** at the **end** of a route will throw an error.
