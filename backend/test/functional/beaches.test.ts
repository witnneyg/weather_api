import { User } from "../../src/models/user";
import AuthService from "../../src/services/auth";
import request from "supertest";
import mongoose from "mongoose";
import { Beach } from "../../src/models/beach";
import app from "../../src/index";

describe("Beaches functional tests", () => {
  const defaultUser = {
    name: "John Doe",
    email: "john2@mail.com",
    password: "1234",
  };

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      serverSelectionTimeoutMS: 30000,
    });
  });

  let token: string;
  beforeEach(async () => {
    await Beach.deleteMany({});
    await User.deleteMany({});
    const user = await new User(defaultUser).save();
    token = AuthService.generateToken(user.toJSON());
  });

  describe("When creating a new beach", () => {
    it("should create a beach with success", async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: "Manly",
        position: "E",
      };

      const response = await request(app)
        .post("/beaches")
        .set({ "x-access-token": token })
        .send(newBeach);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    it("should return a validation error when a field is invalid", async () => {
      const newBeach = {
        lat: "invalid_string",
        lng: 151.289824,
        name: "Manly",
        position: "E",
      };
      const response = await request(app)
        .post("/beaches")
        .set({ "x-access-token": token })
        .send(newBeach);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: 400,
        error: "Bad Request",
        message: "request/body/lat must be number",
      });
    });

    it.skip("should return 500 when there is any error other than validation error", async () => {
      //TODO think in a way to throw a 500
    });
  });
});
