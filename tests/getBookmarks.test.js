const request = require("supertest")

const { mongoose } = require("../db/connection")
const Bookmark = require("../models/bookmark")
const { app } = require("../app")
const { apiRoutes } = require("../routes/api")

const apiRoutePrefix = "/api"

beforeAll(async () => {
  await mongoose.connection.on("connected", () => Promise.resolve())
  await mongoose.connection.dropCollection("bookmarks")
})
afterAll(done => mongoose.disconnect(done))

describe("GET /bookmarks tests", () => {
  test("Get all bookmarks should respond with status code 200", async done => {
    const response = await request(app).get(
      apiRoutePrefix + apiRoutes.getAllBookmarks
    )

    expect(response.statusCode).toBe(200)
    done()
  })

  test("GET /bookmarks contains right amount of bookmarks", async done => {
    // add a bookmark here
    const newBookmarkData = {
      url: "https://awesomedomain.tld",
      title: "best bookmark ever"
    }
    await new Bookmark(newBookmarkData).save()

    const response = await request(app).get(
      apiRoutePrefix + apiRoutes.getAllBookmarks
    )

    const {
      body: { data }
    } = response

    expect(data.bookmark.length).toBe(1)
    expect(data.bookmark[0].url).toEqual(newBookmarkData.url)

    done()
  })
})
