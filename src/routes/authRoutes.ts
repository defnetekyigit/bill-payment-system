/**
 * @swagger
 * /auth/token:
 *   post:
 *     summary: Generate JWT for testing
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: JWT token
 */

import { Router } from "express";
import { generateToken } from "../utils/jwt";

const router = Router();

router.post("/auth/token", (req, res) => {
  const token = generateToken({ user: "mobile-app" }, "1h");
  res.json({ token });
});

export default router;
