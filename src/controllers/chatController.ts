import { Request, Response } from "express";
import { parseIntent } from "../services/chat/intentParser";
import { handleIntent } from "../services/chat/chatService";

export const chatController = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const intent = await parseIntent(message);
    const apiResponse = await handleIntent(intent);

    return res.json({
      userMessage: message,
      intent: intent.intent,
      data: apiResponse.data,
    });
  } catch (err: any) {
    console.error("Chat error:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });

    return res.status(500).json({
      error: err.response?.data,
    });
  }
  
};
