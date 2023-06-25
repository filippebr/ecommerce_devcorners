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
  "firstname": "laurie",
  "lastname": "silva",
  "email": "laurie@hotmail.com",
  "mobile": "0011223325",
  "password": "12345"  
}

describe("Authentication tests", () => {
  test("user registration", async () => {

    const response = await request(app).post("/api/user/register").send(mockUser)
    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))

    // expect(response.status).toBe(201);
  })
})