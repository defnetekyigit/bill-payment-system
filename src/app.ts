import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import billRoutes from "./routes/billRoutes";
import { setupSwagger } from "./swagger/swagger";
import authRoutes from "./routes/authRoutes";
import { logMiddleware } from "./middleware/logMiddleware";
import chatRoutes from "./routes/chatRoutes";
const app = express();

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization"
}));
app.use(logMiddleware);

setupSwagger(app);

// Auth routes
app.use("/api/v1", authRoutes);

// Bill routes
app.use("/api/v1", billRoutes);

// Chat routes
app.use("/api/v1", chatRoutes);
export default app;

