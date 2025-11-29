import express from "express";
import cors from "cors";
import billRoutes from "./routes/billRoutes";
import { setupSwagger } from "./swagger/swagger";
import authRoutes from "./routes/authRoutes";
import { logMiddleware } from "./middleware/logMiddleware";

const app = express();

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization"
}));
app.use(logMiddleware);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});
setupSwagger(app);
app.use("/api/v1", authRoutes);

// Bill routes
app.use("/api/v1", billRoutes);

export default app;

