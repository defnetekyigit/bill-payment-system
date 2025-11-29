import { Request, Response } from "express";
import { bankingQueryService } from "../services/bankingQueryService";

export const bankingQueryController = async (req: Request, res: Response) => {
  try {
    const subscriber_no = req.query.subscriber_no as string;

    if (!subscriber_no) {
      return res.status(400).json({
        error: "subscriber_no is required"
      });
    }

    const data = await bankingQueryService(subscriber_no);

    return res.json({
      subscriber_no,
      unpaid_bills: data
    });

  } catch (err) {
    console.error("Banking Query Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
