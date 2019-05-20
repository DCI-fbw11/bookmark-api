const request = require("supertest")
const app = require("../app")
const { mongoose } = require("../db/connection")

const Bookmark = require("../models/Bookmark")
const { apiRoutes } = require("../routes/bookmarks")
const { authRoutes } = require("../routes/auth")
const decodeToken = require("../helpers/decodeToken")

const apiRoutePrefix = "/api"
const authRoutePrefix = "/auth"

let token
let userID

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
    // add a bookmark here
    const newBookmarkData = {
      url: "https://awesomedomain.tld",
      title: "best bookmark ever",
      userID
    }
    await new Bookmark(newBookmarkData).save()

    const response = await request(app)
      .get(apiRoutePrefix + apiRoutes.getAllBookmarks)
      .set("token", token)

    const {
      body: { data }
    } = response

    expect(data.bookmark.length).toBe(1)
    expect(data.bookmark[0].url).toEqual(newBookmarkData.url)

    done()
  })
})
