import { AxiosStatic } from "axios";

export class StormGlass {
  readonly stormGlassAPIParams =
    "swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed";

  constructor(protected request: AxiosStatic) {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  public async fetchPoints(lat: number, lng: number): Promise<{}> {
    return this.request.get(
      `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}`,
      {
        headers: {
          Authorization: process.env.API_KEY,
        },
      }
    );
  }
}
