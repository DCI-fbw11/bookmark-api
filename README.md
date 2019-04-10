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
