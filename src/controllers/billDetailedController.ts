import { Request, Response } from "express";
import { queryBillDetailedService } from "../services/billDetailedService";

export const queryBillDetailedController = async (
  req: Request,
  res: Response
) => {
  try {
    const subscriber_no = req.query.subscriber_no as string;
    const month = req.query.month as string;

    if (!subscriber_no || !month) {
      return res.status(400).json({
        error: "subscriber_no and month are required",
      });
    }

    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "5");

    const data = await queryBillDetailedService(
      subscriber_no,
      month,
      page,
      limit
    );

    if (!data) {
      return res.status(404).json({ error: "Bill not found" });
    }

    return res.json(data);
  } catch (err) {
    console.error("Detailed Query Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
