import express from "express";
import { Request, Response } from "express";
import { ForecastController } from "./controllers/forecast-controller";
import { config } from "dotenv";
import { databaseConnection } from "./lib/database";
import { BeachesController } from "./controllers/beaches-controller";
import { UsersController } from "./controllers/users-controller";
import { authMiddleware } from "./middlwares/auth";
const app = express();

async function main() {
  config();

  app.use(express.json());

  app.get(
    "/forecast",
    authMiddleware,
    async (req: Request, res: Response): Promise<void> => {
      const forecastController = new ForecastController();

      forecastController.getForecastForLoggedUser(req, res);
    }
  );

  app.post("/beaches", authMiddleware, (req: Request, res: Response) => {
    const beachesController = new BeachesController();

    beachesController.create(req, res);
  });

  app.post("/users", async (req: Request, res: Response) => {
    const userController = new UsersController();

    userController.create(req, res);
  });

  app.post("/users/authenticate", async (req: Request, res: Response) => {
    const userController = new UsersController();

    userController.authenticate(req, res);
  });

  await databaseConnection();
  app.listen(8888, () => {
    console.log("rodando na porta 8888");
  });
}

main();

export default app;
