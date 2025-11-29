import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

export const connectDB = async () => {
  try {
    await pool.connect();
    console.log("PostgreSQL connected successfully!");
  } catch (err) {
    console.error("PostgreSQL connection error:", err);
    process.exit(1);
  }
};
