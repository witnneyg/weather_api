import express from "express";
import { Request, Response } from "express";
import { ForecastController } from "./controllers/forecast-controller";
import { config } from "dotenv";
import { databaseConnection } from "./lib/database";

async function main() {
  const app = express();

  config();

  app.use(express.json());

  app.get("/", async (req: Request, res: Response): Promise<void> => {
    const forecastController = new ForecastController();

    forecastController.getForecastForLoggedUser(req, res);
  });

  await databaseConnection();
  app.listen(8888, () => {
    console.log("rodando na porta 8888");
  });
}

main();
