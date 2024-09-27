import { Request, Response } from "express";
import { Forecast } from "../services/forecast";
import { Beach } from "../models/beach";

const forecast = new Forecast();

export class ForecastController {
  public async getForecastForLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const beaches = await Beach.find({});
      const forecastData = await forecast.processForecastForBeaches(beaches);
      res.status(200).send(forecastData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      res.status(500).send({ error: "Something went wrong" });
    }
  }
}
