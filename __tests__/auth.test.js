import request from 'supertest'
import { describe, expect, test, vi } from "vitest"
import app from '../index'

// Try to create test using this page https://github.com/lunsmat/nodejs-boilerplate/blob/master/src/app.ts

vi.mock("../config/jwtToken", () => ({
  generateToken: vi.fn(() => "jwt_token")
}))

const mockResponse = () => {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  }
}

const mockUser = {
  "firstname": "joe",
  "lastname": "silva",
  "email": "joe@hotmail.com",
  "mobile": "0011223329",
  "password": "12345"  
}

describe("Authentication tests", () => {
  // const userService = new userService.findByEmail('john.doe@example.com')

  // beforeEach(async () => {
  //   const user = await request(app)
  // }) 

  test("user registration", async () => {

    const response = await request(app).post("/api/user/register").send(mockUser)

    console.log("response.app: ", response.request._data)
    expect(response.statusCode).toBe(200)
    expect(response.request._data).toHaveProperty('firstname')
    expect(response.request._data).toHaveProperty('lastname')
    expect(response.request._data).toHaveProperty('email')
    expect(response.request._data).toHaveProperty('mobile')
    expect(response.request._data).toHaveProperty('password')
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))

    // expect(response.status).toBe(201);
  })
})