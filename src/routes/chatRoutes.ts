/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: AI Agent Chat API
 */

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Chat with AI Agent to query or pay bills
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Ocak faturamı göster"
 *     responses:
 *       200:
 *         description: AI Agent response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userMessage:
 *                   type: string
 *                 intent:
 *                   type: string
 *                   example: QUERY_BILL
 *                 data:
 *                   type: object
 */

import { Router } from "express";
import { chatController } from "../controllers/chatController";

const router = Router();

router.post("/chat", chatController);

export default router;
