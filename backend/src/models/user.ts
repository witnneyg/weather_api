import mongoose, { Document, Model } from "mongoose";
import AuthService from "../services/auth";
export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

export enum CUSTOM_VALIDATION {
  DUPLICATED = "DUPLICATED",
}

type UserModel = Omit<User, "_id"> & { _id: string } & Document;

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret.id;
        delete ret.__v;
      },
    },
  }
);

schema.path("email").validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  "already exists in the database",
  CUSTOM_VALIDATION.DUPLICATED
);

schema.pre("save", async function () {
  if (!this.password || !this.isModified("password")) {
    return;
  }

  try {
    const hashedPassword = await AuthService.hashPassword(this.password);
    this.password = hashedPassword;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error(`Error hashing the password for the user ${this.name}`);
  }
});

export const User: Model<UserModel> = mongoose.model<UserModel>("User", schema);
