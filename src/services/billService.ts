import { pool } from "../config/db";
import { Bill } from "../models/billModel";

export const addBillService = async (bill: Bill) => {
  const query = `
    INSERT INTO bills (subscriber_no, month, bill_total, bill_details, paid_amount, remaining_amount, status)
    VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    bill.subscriber_no,
    bill.month,
    bill.bill_total,
    JSON.stringify(bill.bill_details || {}),
    bill.paid_amount ?? 0,
    bill.remaining_amount ?? bill.bill_total,
    bill.status ?? "unpaid"
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};
export const getBillsService = async (): Promise<Bill[]> => {
  const query = `
    SELECT * FROM bills;
  `;

  const result = await pool.query(query);
  return result.rows;
};
