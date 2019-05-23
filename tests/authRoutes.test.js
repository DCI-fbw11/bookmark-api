const request = require("supertest")
const app = require("../app")
const { mongoose } = require("../db/connection")

const { authRoutes } = require("../routes/auth")

const authRoutePrefix = "/auth"

let token

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

    token = response.body.data.token

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

  test("Trying password change with wrong password should respond with failed message", async done => {
    const response = await request(app)
      .post(authRoutePrefix + authRoutes.changePassword)
      .send({
        loginData: {
          username: "testUser2",
          password: "123123",
          new_password: "asdfghjk"
        }
      })

    expect(response.body.data.message).toEqual(
      expect.stringContaining("failed")
    )
    done()
  })

  test("Trying password change with correct password should respond with success message", async done => {
    const response = await request(app)
      .post(authRoutePrefix + authRoutes.changePassword)
      .send({
        loginData: {
          username: "testUser2",
          password: "12345678",
          new_password: "hahahaha"
        }
      })

    expect(response.body.data.message).toEqual(
      expect.stringContaining("success")
    )
    done()
  })

  test("Deleting account should respond with success message", async done => {
    const response = await request(app)
      .delete(authRoutePrefix + authRoutes.deleteAccount)
      .set("token", token)

    expect(response.body.data.message).toEqual(
      expect.stringContaining("deleted")
    )
    done()
  })
})
