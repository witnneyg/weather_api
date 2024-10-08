import { User } from "../../src/models/user";
import { Beach, GeoPosition } from "../../src/models/beach";
import nock from "nock";
import stormGlassWeather3HoursFixture from "../fixtures/stormglass_weather_3_hours.json";
import apiForecastResponse1BeachFixture from "../fixtures/api_forecast_response_1_beach.json";
import AuthService from "../../src/services/auth";
import request from "supertest";
import mongoose from "mongoose";

import app from "../../src/index";

describe("Beach forecast functional tests", () => {
  const defaultUser: User = {
    name: "John Doe",
    email: "john3@mail.com",
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
    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: "Manly",
      position: GeoPosition.E,
      userId: user.id,
    };
    await new Beach(defaultBeach).save();
    token = AuthService.generateToken(user.toJSON());
  });
  it("should return a forecast with just a few times", async () => {
    nock("https://api.stormglass.io", {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ "access-control-allow-origin": "*" })
      .get("/v2/weather/point")
      .query({
        lat: "-33.792726",
        lng: "151.289824",
        params: "waveDirection",
        // params: /(.*)/,
        source: "noaa",
        end: /(.*)/,
      })
      .reply(200, stormGlassWeather3HoursFixture);
    const { body, status } = await request(app)
      .get("/forecast")
      .set({ "x-access-token": token });
    expect(status).toBe(200);
    // Make sure we use toEqual to check value not the object and array itself
    expect(body).toEqual(apiForecastResponse1BeachFixture);
  });

  it("should return 500 if something goes wrong during the processing", async () => {
    nock("https://api.stormglass.io", {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ "access-control-allow-origin": "*" })
      .get("/v1/weather/point")
      .query({ lat: "-33.792726", lng: "151.289824" })
      .replyWithError("Something went wrong");

    const { status } = await request(app)
      .get(`/forecast`)
      .set({ "x-access-token": token });

    expect(status).toBe(500);
  });
});
