import { Request, Response } from "express";
import { Beach } from "../models/beach";
import mongoose from "mongoose";

export class BeachesController {
  public async create(req: Request, res: Response) {
    try {
      const beaches = new Beach(req.body);
      const result = await beaches.save();
      res.status(201).send(result);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(422).send({ error: error.message });
      } else {
        res.status(500).send({ error: "Internal Server Error" });
      }
    }
  }
}
