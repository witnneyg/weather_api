import express from "express";
import { Request, Response } from "express";
import { ForecastController } from "./controllers/forecast-controller";
import { config } from "dotenv";

function main() {
  const app = express();

  config();

  app.use(express.json());

  app.get("", (req: Request, res: Response): void => {
    const forecastController = new ForecastController();

    forecastController.getForecastForLoggedUser(req, res);
  });

  app.listen(8888, () => {
    console.log("rodando na porta 8888");
  });
}

main();
