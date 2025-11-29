import { Request, Response } from "express";
import { payBillService } from "../services/payBillService";

export const payBillController = async (req: Request, res: Response) => {
  try {
    const { subscriber_no, month, amount } = req.body;

    if (!subscriber_no || !month || amount === undefined) {
      return res.status(400).json({
        error: "subscriber_no, month and amount are required",
      });
    }

    const result = await payBillService(subscriber_no, month, amount);

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    return res.json({
      message: result.message,
      bill: result.bill,
    });
  } catch (err) {
    console.error("Pay Bill Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
