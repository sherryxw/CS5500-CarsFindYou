import dotenv from "dotenv";

if (process.env.ENV === "dev" || process.env.ENV === "test") {
  dotenv.config();
}

export default {
  env: process.env.ENV || "dev",
  mongoUrl: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/offers",
  port: Number(process.env.PORT) || 9527,
};
