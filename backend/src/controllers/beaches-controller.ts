import { Request, Response } from "express";

export class BeachesController {
  public async create(req: Request, res: Response) {
    res.status(201).send(req.body);
  }
}
