
import dotenv from "dotenv";

dotenv.config();

declare const process: {
  env: {
    MONGODB_URL: string
  }
}

export const mongoDbUrl = process.env.MONGODB_URL;