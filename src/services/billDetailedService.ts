import { pool } from "../config/db";

export const queryBillDetailedService = async (
  subscriber_no: string,
  month: string,
  page: number,
  limit: number
) => {
  const offset = (page - 1) * limit;

  const query = `
    SELECT *
    FROM bills
    WHERE subscriber_no = $1 AND month = $2
    ORDER BY id
    LIMIT $3 OFFSET $4;
  `;

  const result = await pool.query(query, [
    subscriber_no,
    month,
    limit,
    offset,
  ]);

  return result.rows;
};
