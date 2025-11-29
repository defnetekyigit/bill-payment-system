import { pool } from "../config/db";

export const queryBillService = async (subscriber_no: string, month: string) => {
  const query = `
    SELECT subscriber_no, month, bill_total, status 
    FROM bills 
    WHERE subscriber_no = $1 AND month = $2;
  `;

  const result = await pool.query(query, [subscriber_no, month]);
  return result.rows[0];
};
