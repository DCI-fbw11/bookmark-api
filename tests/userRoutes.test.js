const request = require("supertest")
const app = require("../app")
const { mongoose } = require("../db/connection")

// Route Strings
const { usersRoutes } = require("../routes/users")
const { authRoutes } = require("../routes/auth")

// User model
const User = require("../models/user")

const authRoutePrefix = "/auth"
const usersRoutePrefix = "/admin"

let token

beforeAll(async () => {
  await mongoose.connection.on("connected", () => Promise.resolve())
  await mongoose.connection.dropDatabase()

  await request(app)
    .post(authRoutePrefix + authRoutes.register)
    .send({
      registerData: {
        username: "testAdmin",
        password: "12345678"
      }
    })

  await request(app)
    .post(authRoutePrefix + authRoutes.register)
    .send({
      registerData: {
        username: "randomUser",
        password: "12345678"
      }
    })

  await User.findOneAndUpdate(
    { username: "testAdmin" },
    { role: "admin" },
    { new: true, useFindAndModify: false }
  )

  const loginResponse = await request(app)
    .post(authRoutePrefix + authRoutes.login)
    .send({
      loginData: {
        username: "testAdmin",
        password: "12345678"
      }
    })

  token = loginResponse.body.data.token
})

afterAll(done => mongoose.disconnect(done))

describe("Admin tests", () => {
  test("Get all users should respond with status code 200", async done => {
    const response = await request(app)
      .get(usersRoutePrefix + usersRoutes.users)
      .set("token", token)

    expect(response.statusCode).toBe(200)
    expect(response.body.data.users.length).toBe(2)
    done()
  })

  test("Get all users should respond with the right amount of users", async done => {
    const response = await request(app)
      .get(usersRoutePrefix + usersRoutes.users)
      .set("token", token)

    expect(response.body.data.users.length).toBe(2)
    done()
  })

  test("Delete one user should respond with a success message", async done => {
    const response = await request(app)
      .get(usersRoutePrefix + usersRoutes.users)
      .set("token", token)

    const userToDelete = response.body.data.users[1]._id

    const deleteResponse = await request(app)
      .delete(usersRoutePrefix + usersRoutes.users + `/${userToDelete}`)
      .set("token", token)

    expect(deleteResponse.body.data.message).toEqual(
      expect.stringContaining("deleted")
    )
    done()
  })
})
