import request from 'supertest'
import { afterAll, beforeEach, describe, expect, test, vi } from "vitest"
const { default: mongoose } = require("mongoose");

import app from '../index'
const User = require('../models/userModel')

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
  // const userService = new UserService();

  beforeEach(async () => {
    const user = await User.findOne({email: 'joe@hotmail.com'})

    if (user) {
      await User.findByIdAndDelete(user._id.toString())
    }
  }) 

  afterAll(async () => {
    await mongoose.disconnect()
  })

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
  })

  test('should not register a new user with invalid data', async () => {
    const response = await request(app).post('/api/user/register').send(
      { 
        "firstname": "", 
        "lastname": "", 
        "email": "not a valid email", 
        "mobile": "not a valid mobile", 
        "password": ""
      }
    );

    const res = JSON.parse(response.res.text);

    console.log("response.request._data: ", response.request._data);

    expect(response.statusCode).toBe(500);
    // expect(response.request._data).toBe(null);
    expect(res).toHaveProperty('message');
    // expect(message).toEqual('User already exists');
  });
  
})