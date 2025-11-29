import csv from "csv-parser";
import { Readable } from "stream";
import { addBillService } from "./billService";
import { Bill } from "../models/billModel";

export const csvUploadService = async (fileBuffer: Buffer) => {
  return new Promise((resolve, reject) => {
    const rows: any[] = [];

    Readable.from(fileBuffer)
      .pipe(csv())
      .on("data", (row) => {
        rows.push(row);
      })
      .on("end", async () => {
        const responses: any[] = [];

        for (const r of rows) {
          try {
            const bill_details = r.bill_details
              ? JSON.parse(r.bill_details)
              : {};

            const bill: Bill = {
              subscriber_no: r.subscriber_no,
              month: r.month,
              bill_total: Number(r.bill_total),
              bill_details,
              paid_amount: 0,
              remaining_amount: Number(r.bill_total),
              status: "unpaid",
            };

            await addBillService(bill);

            responses.push({
              subscriber_no: r.subscriber_no,
              month: r.month,
              status: "added",
            });
          } catch (err) {
            responses.push({
              subscriber_no: r.subscriber_no,
              month: r.month,
              status: "error",
              error: String(err),
            });
          }
        }

        resolve(responses);
      })
      .on("error", (err) => reject(err));
  });
};
