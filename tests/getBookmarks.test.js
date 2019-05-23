const request = require("supertest")
const app = require("../app")
const { mongoose } = require("../db/connection")

const Bookmark = require("../models/bookmark")
const { apiRoutes } = require("../routes/bookmarks")
const { authRoutes } = require("../routes/auth")
const decodeToken = require("../helpers/decodeToken")

const apiRoutePrefix = "/api"
const authRoutePrefix = "/auth"

let token
let userID
let singleBookmarkID

beforeAll(async () => {
  await mongoose.connection.on("connected", () => Promise.resolve())
  await mongoose.connection.dropDatabase()

  await request(app)
    .post(authRoutePrefix + authRoutes.register)
    .send({
      registerData: {
        username: "testUser",
        password: "12345678"
      }
    })

  const loginResponse = await request(app)
    .post(authRoutePrefix + authRoutes.login)
    .send({
      loginData: {
        username: "testUser",
        password: "12345678"
      }
    })

  token = loginResponse.body.data.token
  // decode token here to get the ID from it
  const { user: stringID } = await decodeToken(token)

  userID = mongoose.Types.ObjectId(stringID)
})

afterAll(done => mongoose.disconnect(done))

describe("GET /bookmarks tests", () => {
  test("Get all bookmarks WITHOUT authentication should respond with status code 500", async done => {
    const response = await request(app).get(
      apiRoutePrefix + apiRoutes.getAllBookmarks
    )

    expect(response.statusCode).toBe(500)
    done()
  })

  test("Get all bookmarks WITH authentication should respond with status code 200", async done => {
    const response = await request(app)
      .get(apiRoutePrefix + apiRoutes.getAllBookmarks)
      .set("token", token)

    expect(response.statusCode).toBe(200)
    done()
  })

  test("GET /bookmarks contains right amount of bookmarks", async done => {
    const newBookmarkData = {
      url: "https://awesomedomain.tld",
      title: "best bookmark ever",
      tag: ["funny"],
      userID
    }

    await new Bookmark(newBookmarkData).save()

    const response = await request(app)
      .get(apiRoutePrefix + apiRoutes.getAllBookmarks)
      .set("token", token)

    const {
      body: { data }
    } = response

    singleBookmarkID = data.bookmark[0]._id

    expect(data.bookmark.length).toBe(1)
    expect(data.bookmark[0].url).toEqual(newBookmarkData.url)

    done()
  })

  test("GET /bookmarks/:id returns a bookmark with the passed id back", async done => {
    const response = await request(app)
      .get(apiRoutePrefix + apiRoutes.getAllBookmarks + `/${singleBookmarkID}`)
      .set("token", token)

    const {
      body: { data }
    } = response
    expect(data.bookmark._id).toEqual(singleBookmarkID)

    done()
  })

  test("GET /bookmarks/tag/?tags=funny returns a bookmark with that contains the funny tag", async done => {
    const response = await request(app)
      .get(apiRoutePrefix + apiRoutes.getBookmarkByTag + "?tags=funny")
      .set("token", token)

    const {
      body: { data }
    } = response

    expect(data.bookmark[0].tag).toContain("funny")

    done()
  })

  test("GET /bookmarks/date/ returns one matched bookmark", async done => {
    const newBookmarkWithDate = {
      url: "https://awesomedomain.tld",
      title: "date range test",
      userID,
      createdAt: "2011,12,27"
    }

    await new Bookmark(newBookmarkWithDate).save()

    const response = await request(app)
      .get(
        apiRoutePrefix +
          apiRoutes.getBookmarkByDateRange +
          "?startDate=2011.12.27"
      )
      .set("token", token)

    const {
      body: { data }
    } = response

    expect(data.bookmark.length).toBe(1)
    done()
  })

  test("POST /bookmarks returns the newly created bookmark", async done => {
    const postBookmarkTestData = {
      url: "https://secondbookmark.tld",
      title: "second best bookmark ever",
      tag: ["not funny"],
      userID
    }

    const response = await request(app)
      .post(apiRoutePrefix + apiRoutes.postBookmark)
      .send(postBookmarkTestData)
      .set("token", token)

    const {
      body: { data }
    } = response

    expect(data.bookmark._id).not.toBeNull()
    expect(data.bookmark.url).toBe(postBookmarkTestData.url)

    done()
  })

  test("PUT /bookmarks/:id returns the updated bookmark", async done => {
    const updateBookmarkTestData = {
      url: "https://changedurl.io"
    }

    const response = await request(app)
      .put(apiRoutePrefix + apiRoutes.getAllBookmarks + `/${singleBookmarkID}`)
      .send(updateBookmarkTestData)
      .set("token", token)

    const {
      body: { data }
    } = response

    expect(data.bookmark._id).toBe(singleBookmarkID)
    expect(data.bookmark.url).toBe(updateBookmarkTestData.url)
    expect(data.message).toEqual(expect.stringContaining("updated"))

    done()
  })

  test("DELETE /bookmarks/:id returns a success message for the deleted bookmark", async done => {
    const response = await request(app)
      .delete(
        apiRoutePrefix + apiRoutes.getAllBookmarks + `/${singleBookmarkID}`
      )
      .set("token", token)

    const {
      body: { data }
    } = response

    expect(data.bookmark._id).toBe(singleBookmarkID)
    expect(data.message).toEqual(expect.stringContaining("deleted"))

    done()
  })

  test("GET /bookmarks?sortOrder=ASC&sortValue=url returns bookmarks sorted ascending by url ", async done => {
    const response = await request(app)
      .get(
        apiRoutePrefix +
          apiRoutes.getAllBookmarks +
          "?sortOrder=ASC&sortValue=url"
      )
      .set("token", token)

    const {
      body: { data }
    } = response

    expect(data.bookmark[1].url).toBe("https://secondbookmark.tld")

    done()
  })

  test("DELETE /bookmarks/delete/ returns a success deleted message", async done => {
    const batchDeleteTestArray = []

    const response = await request(app)
      .get(apiRoutePrefix + apiRoutes.getAllBookmarks)
      .set("token", token)
    const {
      body: { data }
    } = response

    data.bookmark.forEach(bookmark => batchDeleteTestArray.push(bookmark._id))

    const deleteResponse = await request(app)
      .delete(apiRoutePrefix + apiRoutes.batchDeleteBookmarks)
      .send({ bookmarkIDs: batchDeleteTestArray })
      .set("token", token)

    const {
      body: { data: deleteResponseData }
    } = deleteResponse

    expect(deleteResponseData.message).toEqual(
      expect.stringContaining("deleted")
    )

    done()
  })
})
