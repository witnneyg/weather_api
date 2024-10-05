import express from "express";
import { config } from "dotenv";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import { Request, Response } from "express";
import { OpenAPIV3 } from "express-openapi-validator/dist/framework/types";
import { middleware as OpenApiValidator } from "express-openapi-validator";

import { ForecastController } from "./controllers/forecast-controller";
import { databaseConnection } from "./lib/database";
import { BeachesController } from "./controllers/beaches-controller";
import { UsersController } from "./controllers/users-controller";
import { authMiddleware } from "./middlwares/auth";
import { apiErrorValidator } from "./middlwares/api-error-validator";
import apiSchema from "./api.schema.json";

const app = express();

async function main() {
  config();

  app.use(express.json());
  app.use(cors());

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(apiSchema));

  app.use(
    OpenApiValidator({
      apiSpec: apiSchema as OpenAPIV3.Document,
      validateRequests: true,
      validateResponses: true,
    })
  );

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

  app.use(apiErrorValidator);
  await databaseConnection();

  app.listen(8888, () => {
    console.log("rodando na porta 8888");
  });
}

main();

export default app;
