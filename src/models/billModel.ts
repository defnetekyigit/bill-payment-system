export interface Bill {
  subscriber_no: string;
  month: string;
  bill_total: number;
  bill_details: any;
  paid_amount: number;
  remaining_amount: number;
  status: "paid" | "unpaid";
}
