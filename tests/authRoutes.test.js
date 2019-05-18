const request = require("supertest")
const app = require("../app")
const { mongoose } = require("../db/connection")

const { authRoutes } = require("../routes/auth")

const authRoutePrefix = "/auth"

beforeAll(async () => {
  await mongoose.connection.on("connected", () => Promise.resolve())
  await mongoose.connection.dropDatabase()
})

afterAll(done => mongoose.disconnect(done))

describe("Auth tests", () => {
  test("Register should respond with status code 200", async done => {
    const response = await request(app)
      .post(authRoutePrefix + authRoutes.register)
      .send({
        registerData: {
          username: "testUser2",
          password: "12345678"
        }
      })

    expect(response.statusCode).toBe(200)
    done()
  })

  test("Login should respond with a token", async done => {
    const response = await request(app)
      .post(authRoutePrefix + authRoutes.login)
      .send({
        loginData: {
          username: "testUser2",
          password: "12345678"
        }
      })

    expect(response.body.data.token).not.toBeNull()
    done()
  })

  test("Login with wrong password should respond with a null token", async done => {
    const response = await request(app)
      .post(authRoutePrefix + authRoutes.login)
      .send({
        loginData: {
          username: "testUser2",
          password: "1234asasda5678"
        }
      })

    expect(response.body.data.token).toBeNull()
    done()
  })
})
