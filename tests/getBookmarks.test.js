const request = require("supertest")
const mongoose = require("mongoose")
const app = require("../app")
const { apiRoutes } = require("../routes/api")

const apiRoutePrefix = "/api"

afterAll(() => mongoose.disconnect())

describe("GET /bookmarks tests", () => {
  test("Get all bookmarks should respond with status code 200", async () => {
    const response = await request(app).get(
      apiRoutePrefix + apiRoutes.getAllBookmarks
    )

    expect(response.statusCode).toBe(200)
  })
})
