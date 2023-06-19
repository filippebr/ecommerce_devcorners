import supertest from "supertest"
import { describe, expect, test } from "vitest"
// import app from "../index"
import app from '../index'

// Try to create test using this page https://github.com/lunsmat/nodejs-boilerplate/blob/master/src/app.ts

describe("Authentication tests", () => {
  test("user registration", async () => {
    const response = await supertest(app).post(`/api/user/users`).send({
      "firstname": "joao",
      "lastname": "silva",
      "email": "joão@hotmail.com",
      "mobile": "0011223300",
      "password": "123450"
    });

    expect(response.status).toBe(404);
  })
})