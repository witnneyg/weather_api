import { Request, Response } from "express";
import { Beach } from "../models/beach";
import { BaseController } from ".";

export class BeachesController extends BaseController {
  public async create(req: Request, res: Response) {
    try {
      const beaches = new Beach({ ...req.body, ...{ user: req.decoded.id } });
      const result = await beaches.save();
      res.status(201).send(result);
    } catch (error) {
      this.sendCreatedUpdateErrorResponse(res, error);
    }
  }
}
