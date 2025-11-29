import { pool } from "../config/db";

export const payBillService = async (
  subscriber_no: string,
  month: string,
  amount: number
) => {
  if (amount <= 0) {
    return {
      success: false,
      message: "Amount must be greater than 0",
    };
  }

  const existing = await pool.query(
    "SELECT * FROM bills WHERE subscriber_no = $1 AND month = $2",
    [subscriber_no, month]
  );

  if (existing.rows.length === 0) {
    return {
      success: false,
      message: "Bill not found for given subscriber and month",
    };
  }

  const bill = existing.rows[0];

  if (bill.remaining_amount <= 0 || bill.status === "paid") {
    return {
      success: false,
      message: "Bill is already fully paid",
    };
  }

  const newPaid = Number(bill.paid_amount) + amount;
  const remaining = Number(bill.bill_total) - newPaid;

  if (remaining < 0) {
    return {
      success: false,
      message: `Payment exceeds remaining amount. Remaining: ${
        bill.bill_total - bill.paid_amount
      }`,
    };
  }

  const newStatus = remaining === 0 ? "paid" : "unpaid";

  const updateResult = await pool.query(
    `
    UPDATE bills
    SET paid_amount = $3,
        remaining_amount = $4,
        status = $5
    WHERE subscriber_no = $1 AND month = $2
    RETURNING *;
  `,
    [subscriber_no, month, newPaid, remaining, newStatus]
  );

  const updatedBill = updateResult.rows[0];

  return {
    success: true,
    message: remaining === 0 ? "Bill fully paid" : "Partial payment successful",
    bill: updatedBill,
  };
};
