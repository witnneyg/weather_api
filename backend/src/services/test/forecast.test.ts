import { StormGlass } from "../../clients/stormGlass";
import stormGlassNormalizedResponseFixture from "../../../test/fixtures/stormGlass_normalized_response_3_hours.json";
import { Beach, BeachPosition, Forecast } from "../forecast";

jest.mock("../../clients/stormGlass");

describe("Forecast Service", () => {
  it("should return the forecast for a list of beaches", async () => {
    StormGlass.prototype.fetchPoints = jest
      .fn()
      .mockResolvedValue(stormGlassNormalizedResponseFixture);

    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: "Manly",
        position: BeachPosition.E,
        user: "some-id",
      },
    ];

    const expectedResponse = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: "Manly",
        position: "E",
        rating: 1,
        swellDirection: 81.33,
        swellHeight: 0.1,
        swellPeriod: 10.95,
        time: "2024-09-20T00:00:00+00:00",
        waveDirection: 184.91,
        waveHeight: 1.09,
        windDirection: 259.81,
        windSpeed: 7.74,
      },
      {
        lat: -33.792726,
        lng: 151.289824,
        name: "Manly",
        position: "E",
        rating: 1,
        swellDirection: 116.61,
        swellHeight: 0.37,
        swellPeriod: 10.78,
        time: "2024-09-20T01:00:00+00:00",
        waveDirection: 184.92,
        waveHeight: 1.03,
        windDirection: 309.1,
        windSpeed: 5.87,
      },
    ];

    const forecast = new Forecast(new StormGlass());
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);

    expect(beachesWithRating).toEqual(expectedResponse);
  });
});
