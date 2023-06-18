import request from "supertest"
import { describe, expect, test } from "vitest"
import { app } from "./app"

// Try to create test using this page https://github.com/lunsmat/nodejs-boilerplate/blob/master/src/app.ts

describe("Authentication tests", () => {
  test("should register a new user", async () => {
    const response = await request(app.instance).post(process.env.PORT + '/api/user/register').send({
      "firstname": "jose",
      "lastname": "silva",
      "email": "jose@hotmail.com",
      "mobile": "0011223344",
      "password": "12345"
    });

    expect(response.status).toBe(201);
  })
})