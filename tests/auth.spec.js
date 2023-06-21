import supertest from "supertest"
import { describe, expect, test } from "vitest"
// import app from "../index"
import app from '../index'

// Try to create test using this page https://github.com/lunsmat/nodejs-boilerplate/blob/master/src/app.ts



const mockUser = {
  firstname: "robert",
  lastname: "silva",
  email: "robert@hotmail.com",
  mobile: "0011223311",
  password: "12345"  
}

describe("Authentication tests", () => {
  test("user registration", async () => {
    const response = await supertest(app).post(`/api/user/register`).send({
      "firstname": "daniel",
      "lastname": "silva",
      "email": "daniel@hotmail.com",
      "mobile": "0011223311",
      "password": "123459"
    });

    expect(response.status).toBe(201);
  })
})