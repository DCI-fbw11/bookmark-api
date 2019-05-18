# Bookmark Api

> DCI-Students Project of class FBW-11

Base URL: https://bookmark-api.fbw-11.now.sh/

## Authentication Endpoints

### Register

- POST
  - auth/register

```js
{
 "registerData" : {
    "username": "string",
    "password": "string",
  }
}
```

### Login

- POST
  - auth/login

```js
{
 "loginData" : {
    "username": "string",
    "password": "string",
  }
}
```

The response returns a token which you need to pass into the header named token

**Returned example**

```js
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNWNkYTc3ODAyZWZiNDMwN2I1NTUwZTgxIiwiaWF0IjoxNTU4MDE1NzE2LCJleHAiOjE1NTgwMTkzMTZ9.8rpXz-yrHADIKhhHN_7Xpw42Zja9dceXLWDaX83GYqQ"
}
```

# Bookmarks Endpoints

This will show you the expected **input** for each **endpoint** and the **value** it returns.

## Get **ALL** Bookmarks

- GET
  - api/bookmarks

The endpoint `/api/bookmarks` will show all bookmarks in the database.

## Get Bookmark by ID

- GET
  - api/bookmarks/:id

To see a specific bookmark, the bookmark \_id is required and can be added in the following way : `/api/bookmarks/:id`.

## Create a new Bookmark

- POST

  - api/bookmarks

  In POST please provide the minimum

```js
{
    title: {
      type: String,
      maxlength: 50,
    },
    shortDescription: {
      type: String,
      maxlength: 150,
    },
    url: {
      type: String,
      required: true
    }
}
```

To add a bookmark to the database, use the `/api/bookmarks` endpoint. **A url is required.** A title, short description or tags are optional.

## Update Bookmark by ID

- PUT
  - api/bookmarks/:id

```js
{
    url: {
      type: String,
      required: true
    }
}
```

In update please provide the minimum

To update a bookmark in the database, use the `/api/bookmarks` endpoint. To update a bookmark, the bookmark \_id, the key and the updated value are required.

## Delete Bookmark by ID

- DELETE
  - api/bookmarks/:id

Provide the \_id of the bookmark you want to delete to the `/api/bookmarks` endpoint in this way: `/api/bookmarks/:id`.

> **ProTip:** The routes a strict, which means that a **"/"** at the **end** of a route will throw an error.
