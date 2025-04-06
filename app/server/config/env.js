import { config } from "dotenv";

config({ path: `.env.${process.env.ENVIRONMENT || "development"}` });

export const {
  ENVIRONMENT,
  PORT,
  HOST,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ENC_ALGORITHM,
  ENC_SECRET_KEY,
  ARCJET_KEY,
  ADMIN_USERNAME,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
} = process.env;
