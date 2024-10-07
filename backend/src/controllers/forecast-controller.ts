import { Request, Response } from "express";
import { Forecast } from "../services/forecast";
import { Beach } from "../models/beach";
import { BaseController } from ".";

const forecast = new Forecast();

export class ForecastController extends BaseController {
  public async getForecastForLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const beaches = await Beach.find({ userId: req.decoded.id });
      const forecastData = await forecast.processForecastForBeaches(beaches);
      res.status(200).send(forecastData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      this.sendErrorResponse(res, {
        code: 500,
        message: "Something went wrong",
      });
    }
  }
}
