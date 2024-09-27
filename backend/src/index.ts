import express from "express";
import { Request, Response } from "express";
import { ForecastController } from "./controllers/forecast-controller";
import { config } from "dotenv";
import { databaseConnection } from "./lib/database";
import { BeachesController } from "./controllers/beaches-controller";

async function main() {
  const app = express();

  config();

  app.use(express.json());

  app.get("/forecast", async (req: Request, res: Response): Promise<void> => {
    const forecastController = new ForecastController();

    forecastController.getForecastForLoggedUser(req, res);
  });

  app.post("/beaches", (req: Request, res: Response) => {
    const beachesController = new BeachesController();

    beachesController.create(req, res);
  });

  await databaseConnection();
  app.listen(8888, () => {
    console.log("rodando na porta 8888");
  });
}

main();
