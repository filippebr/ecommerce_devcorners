import request from 'supertest'
import { describe, expect, test } from 'vitest'
import app from '../index'

describe("POST /users", () => {
  describe("given a username and password", () => {

    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/users").send({
        username: "username",
        password: "password"
      })
      expect(response.statusCode).toBe(200)
    })
  })
}) 