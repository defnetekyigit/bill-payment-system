import { pool } from "../config/db";

export const bankingQueryService = async (subscriber_no: string) => {
  const query = `
    SELECT subscriber_no, month, bill_total, remaining_amount, status
    FROM bills
    WHERE subscriber_no = $1 AND status = 'unpaid';
  `;

  const result = await pool.query(query, [subscriber_no]);
  return result.rows;
};
