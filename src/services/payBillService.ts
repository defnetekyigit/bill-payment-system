import { pool } from "../config/db";

export const payBillService = async (subscriber_no: string, month: string, amount: number) => {
  const query = `
    UPDATE bills
    SET paid_amount = paid_amount + $3,
        remaining_amount = bill_total - (paid_amount + $3),
        status = CASE
                    WHEN bill_total <= paid_amount + $3 THEN 'paid'
                    ELSE 'partial'
                 END
    WHERE subscriber_no = $1 AND month = $2
    RETURNING *;
  `;

  const result = await pool.query(query, [
    subscriber_no,
    month,
    amount
  ]);

  return result.rows[0];
};
