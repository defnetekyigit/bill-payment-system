import { Request, Response } from "express";
import { Bill } from "../models/billModel";
import { addBillService, getBillsService } from "../services/billService";

export const addBillController = async (req: Request, res: Response) => {
  try {
    const { subscriber_no, month, bill_total, bill_details } = req.body;

    if (!subscriber_no || !month || !bill_total) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newBill: Bill = {
      subscriber_no,
      month,
      bill_total,
      bill_details: bill_details || {},
      paid_amount: 0,
      remaining_amount: bill_total,
      status: "unpaid",
    };

    const saved = await addBillService(newBill);

    return res.status(201).json({
      message: "Bill added successfully",
      bill: saved,
    });
  } catch (err) {
    console.error("Add Bill error:", err);
    return res.status(500).json({ error: "Server error while adding bill" });
  }
};

// Tüm bill'leri dönen endpoint 
export const listBillsController = async (req: Request, res: Response) => {
  const data = await getBillsService();
  return res.json(data);
};
