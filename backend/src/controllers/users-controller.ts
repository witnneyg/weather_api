import { Request, Response } from "express";
import { User } from "../models/user";

export class Users {
  public create(req: Request, res: Response) {
    try {
      const user = new User(req.body);

      const newUser = user.save();

      res.status(201).send(newUser);
    } catch (error) {
      res.status(400).send(error);
    }
  }
}
