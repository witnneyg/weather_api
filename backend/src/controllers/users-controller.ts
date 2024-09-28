import { Request, Response } from "express";
import { User } from "../models/user";
import { BaseController } from ".";

export class UsersController extends BaseController {
  public async create(req: Request, res: Response) {
    try {
      const user = new User(req.body);
      const newUser = await user.save();

      res.status(201).send(newUser);
    } catch (error) {
      this.sendCreatedUpdateErrorResponse(res, error);
    }
  }
}
