import { Request, Response } from "express";
import { User } from "../models/user";
import { BaseController } from ".";
import AuthService from "../services/auth";

export class UsersController extends BaseController {
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();

      res.status(201).send(newUser);
    } catch (error) {
      this.sendCreatedUpdateErrorResponse(res, error);
    }
  }

  public async authenticate(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).send({
          code: 401,
          error: "User not found!",
        });
      }

      if (!(await AuthService.comparePasswords(password, user.password))) {
        return res.status(401).send({
          code: 401,
          error: "Password does not match!",
        });
      }

      const token = AuthService.generateToken(user.toJSON());

      return res.status(200).send({ token: token });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
}
