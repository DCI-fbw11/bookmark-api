# Bookmark Api

> DCI-Students Project of class FBW-11

Base URL: https://bookmark-api.fbw-11.now.sh/

# Roles

There a two existing roles for the api **user** and **admin**.
By default every new registered account will be flag as a user.
If you want to create an admin please contact FBW-11 :)

# Schema

The schema of the API are the following:

## User-Schema

```js
{
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
  }
}
```

## Bookmark-Schema

```js
{
  title: {
    type: String,
    maxlength: 50,
    default: "No title"
  },
  shortDescription: {
    type: String,
    maxlength: 150,
    default: ""
  },
  url: {
    type: String,
    required: true
  },
  tag: {
    type: [{ type: String, maxlength: 50 }]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date
  },
  userID: {
    type: Schema.Types.ObjectId,
    required: true
  }
}
```

# Authentication Endpoints

### Register

- POST
  - auth/register

```js
{
 "registerData" : {
    "username": "string",
    "password": "string"
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
    "password": "string"
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

### Change Password

- Post
  - auth/password

```js
{
 "loginData" : {
    "username": "string",
    "password": "string",
    "new_password": "string"
  }
}
```

To change a password of a user use the `auth/password` endpoint.

### Delete Account

- DELTE
  - auth/delete-account

To delete an user account login and use the `auth/delete-account` on deletion all of the users bookmarks will also be deleted

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


## Get Bookmark by Tag

- GET
  - api/bookmarks/tag/?tags="search string","search string"

To see bookmarks with a specific tag or combination of tags use the `api/bookmarks/tag` endpoint. If multiple tag are given only the bookmarks are shown wich contain **ALL** of the tags.

## Get Bookmark by Date and Date Range

- GET
  - api/bookmarks/date/?startDate=year.month.day&endDate=year.month.day

To get bookmark from a specific date or date range , the `?startDate` is required and can be added in the query. The `endDate` can be added in case you want bookmarks from a date range.

## Get sorted Bookmarks

- GET
  - api/bookmarks?sortOrder=ORDER&sortValue=VALUE

To get a sorted view of the bookmarks add the `?sortOrder="string"&sortValue="string"` to your query. Only one of the query string is required
the other one will use a default value.
The `sortOrder` will be ascending ("ASC") by default (the other option is "DESC") and `sortValue` will use the **createdAt** as default value.
The `sortValue` can be either **url**, **title** or **createdAt**.

## Create a new Bookmark

- POST

  - api/bookmarks

  In POST please provide the minimum

```js
{
    title: {
      type: String,
      maxlength: 50
    },
    shortDescription: {
      type: String,
      maxlength: 150
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


## Batch Delete Bookmarks

- DELETE
  - api/bookmarks/delete/

```js
{
  "bookmarkIDs" : [ID,ID...]
}
```

To delete multiple bookmarks at once use the `/api/bookmarks/delete` endpoint and provide the bookmark \_id`s you want to delete in the "bookmarkIDs" array.

# Admin Endpoints

## Get **ALL** Users

- GET
  - admin/users

If an account has an admin role, the `admin/users` endpoint can be used to display all existing accounts.

## Delete an Account

- DELETE
  - admin/users/:id

An account with the admin role can delete any acount by using the `admin/users/:id` endpoint, deleting the account all its bookmark will also be deleted.


> **ProTip:** The routes a strict, which means that a **"/"** at the **end** of a route will throw an error.
