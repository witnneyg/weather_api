import mongoose from "mongoose";

export async function databaseConnection() {
  if (!global.mongoose) {
    try {
      global.mongoose = await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
      console.log(error);
    }
  }
}

export const close = (): Promise<void> => mongoose.connection.close();
