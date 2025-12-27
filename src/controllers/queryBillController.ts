import { Request, Response } from "express";
import { queryBillService } from "../services/billQueryService";

export const queryBillController = async (req: Request, res: Response) => {
  try {
    const subscriber_no = req.query.subscriber_no as string;
    const month = req.query.month as string;

    if (!subscriber_no || !month) {
      return res
        .status(400)
        .json({ error: "subscriber_no and month are required" });
    }

    const bill = await queryBillService(subscriber_no, month);

    if (bill.error) {
      return res.status(400).json({ message: bill.error });
    }
    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }

    return res.json({
      subscriber_no: bill.subscriber_no,
      month: bill.month,
      bill_total: bill.bill_total,
      remaining_amount: bill.remaining_amount,
      paid_status: bill.status,
    });
  } catch (err) {
    console.error("QueryBill Error:", err);

    return res.status(500).json({ error: "Server error" });
  }
};
