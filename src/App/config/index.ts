import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  URL: process.env.DATABASE_URL,
  SALT_ROUND: process.env.SALT_ROUND,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
  LOCAL_URL: process.env.LOCAL_URL,
  EMAIL: process.env.EMAIL,
  PASSWORD: process.env.PASSWORD,
};
