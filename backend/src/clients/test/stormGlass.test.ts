import { StormGlass } from "../stormGlass";
import axios from "axios";
import stormGlassWeather3HoursFixture from "../../../test/fixtures/stormglass_weather_3_hours.json";
import stormGlassNormalized3HoursFixture from "../../../test/fixtures/stormGlass_normalized_response_3_hours.json";

jest.mock("axios");

describe("StormGlass clien", () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture });

  it("should return the normalized forecast from the StormGlass service", async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalized3HoursFixture);
  });

  it("should exclude incomplete data points", async () => {
    const lat = -33.792726;
    const lng = 151.289824;
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: "2020-04-26T00:00:00+00:00",
        },
      ],
    };

    mockedAxios.get.mockResolvedValue({ data: incompleteResponse });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual([]);
  });

  it("should get a generic error form StormGlashh service when the request fail before reaching the service", async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedAxios.get.mockRejectedValue({ message: "Network Error" });

    const stormGlass = new StormGlass(mockedAxios);
    const resolve = stormGlass.fetchPoints(lat, lng);

    expect(resolve).rejects.toThrow(
      "Unexpected error when trying to communicate to StormGlass: Network Error"
    );
  });
});
