import request from 'supertest'
import { describe, expect, test } from 'vitest'
import app from '../index'

describe("POST /users", () => {
  describe("given a username and password", () => {
    // should save the username and password to the database
    // should respond with a json object containing the user id

    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/users").send({
        username: "username",
        password: "password"
      })
      expect(response.statusCode).toBe(200)
    })
    // should respond with a 200 status code 
    // should specify json in the content type header
  })

  // describe("when the username and password is missing", () => {
  //   // should respond with a status code of 400
  // })  
}) 