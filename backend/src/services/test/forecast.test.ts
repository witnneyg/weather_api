import { StormGlass } from "../../clients/stormGlass";
import stormGlassNormalizedResponseFixture from "../../../test/fixtures/stormGlass_normalized_response_3_hours.json";
import { Forecast, ForecastProcessingInternalError } from "../forecast";
import { Beach, GeoPosition } from "../../models/beach";

jest.mock("../../clients/stormGlass");

describe("Forecast Service", () => {
  const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>;

  it("should return the forecast for a list of beaches", async () => {
    mockedStormGlassService.fetchPoints.mockResolvedValue(
      stormGlassNormalizedResponseFixture
    );

    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: "Manly",
        position: GeoPosition.E,
        user: "fake-id",
      },
    ];

    const expectedResponse = [
      {
        time: "2024-09-20T00:00:00+00:00",
        forecast: [
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
        ],
      },
      {
        time: "2024-09-20T01:00:00+00:00",
        forecast: [
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
        ],
      },
    ];

    const forecast = new Forecast(mockedStormGlassService);
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);

    expect(beachesWithRating).toEqual(expectedResponse);
  });

  it("should return an empty list when the beaches array is empty", async () => {
    const forecast = new Forecast();
    const response = await forecast.processForecastForBeaches([]);

    expect(response).toEqual([]);
  });

  it("should throw internal processing error when something goes wrong during the rating process", async () => {
    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: "Manly",
        position: GeoPosition.E,
        user: "faker-id",
      },
    ];

    mockedStormGlassService.fetchPoints.mockRejectedValue("Error fething data");

    const forecast = new Forecast(mockedStormGlassService);
    const response = forecast.processForecastForBeaches(beaches);
    expect(response).rejects.toThrow(ForecastProcessingInternalError);
  });
});
