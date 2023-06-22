import { describe, test, vi } from "vitest"
// import app from '../index'

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
  firstname: "robert",
  lastname: "silva",
  email: "robert@hotmail.com",
  mobile: "0011223311",
  password: "12345"  
}

describe("Authentication tests", () => {
  test("user registration", async () => {
    // const response = await request(app).post(`/api/user/register`).send({
    //   "firstname": "daniel",
    //   "lastname": "silva",
    //   "email": "daniel@hotmail.com",
    //   "mobile": "0011223311",
    //   "password": "123459"
    // });

    // expect(response.status).toBe(201);
  })
})