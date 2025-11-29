import { pool } from "../config/db";
import { Bill } from "../models/billModel";

export const addBillService = async (bill: Bill) => {
  const exists = await pool.query(
    "SELECT * FROM bills WHERE subscriber_no = $1 AND month = $2",
    [bill.subscriber_no, bill.month]
  );

  if (exists.rows.length > 0) {
    return { error: "Bill already exists for this subscriber and month" };
  }

  const result = await pool.query(
    `INSERT INTO bills (subscriber_no, month, bill_total, paid_amount, remaining_amount, status, bill_details)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      bill.subscriber_no,
      bill.month,
      bill.bill_total,
      bill.paid_amount,
      bill.remaining_amount,
      bill.status,
      bill.bill_details
    ]
  );

  return { bill: result.rows[0] };
};

export const getBillsService = async (): Promise<Bill[]> => {
  const query = `
    SELECT * FROM bills;
  `;

  const result = await pool.query(query);
  return result.rows;
};
