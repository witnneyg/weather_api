import { InternalError } from "../util/errors/internal-error";
import * as HTTPUtil from "../util/request";
// import { TimeUtil } from "../util/time";
export interface StormGlassPointSource {
  [key: string]: number;
}

export interface StormGlassPoint {
  time: string;
  waveHeight: StormGlassPointSource;
  waveDirection: StormGlassPointSource;
  swellDirection: StormGlassPointSource;
  swellHeight: StormGlassPointSource;
  swellPeriod: StormGlassPointSource;
  windDirection: StormGlassPointSource;
  windSpeed: StormGlassPointSource;
}

export interface StormGlassForescastResponse {
  hours: StormGlassPoint[];
}

export interface ForecastPoint {
  time: string;
  waveHeight: number;
  waveDirection: number;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  windDirection: number;
  windSpeed: number;
}

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      "Unexpected error when trying to communicate to StormGlass";
    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      "Unexpected error returned by the StormGlass service";
    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlass {
  readonly stormGlassAPIParams =
    "swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed";
  readonly stormGlassAPISource = "noaa";
  constructor(protected request = new HTTPUtil.Request()) {}
  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    // const endTimestamp = TimeUtil.getUnixTimeForFutureDay(1);
    // `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}
    // &params=${this.stormGlassAPIParams}&end=${endTimestamp}`,
    try {
      const response = await this.request.get<StormGlassForescastResponse>(
        `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}
        &params=${this.stormGlassAPIParams}`,
        {
          headers: {
            Authorization: process.env.API_KEY,
          },
        }
      );
      return this.normalizedReponse(response.data);
    } catch (error) {
      if (HTTPUtil.Request.isRequestError(error)) {
        throw new StormGlassResponseError(
          `Error: ${JSON.stringify(error.response.data)} Code: ${error.response.status}`
        );
      }
      throw new ClientRequestError(error.message);
    }
  }

  private normalizedReponse(
    points: StormGlassForescastResponse
  ): ForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      swellDirection: point.swellDirection[this.stormGlassAPISource],
      swellHeight: point.swellHeight[this.stormGlassAPISource],
      swellPeriod: point.swellPeriod[this.stormGlassAPISource],
      time: point.time,
      waveDirection: point.waveDirection[this.stormGlassAPISource],
      waveHeight: point.waveHeight[this.stormGlassAPISource],
      windDirection: point.windDirection[this.stormGlassAPISource],
      windSpeed: point.windSpeed[this.stormGlassAPISource],
    }));
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    );
  }
}
