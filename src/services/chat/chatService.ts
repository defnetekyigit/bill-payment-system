import axios from "axios";
import { ParsedIntent } from "./intentParser";

const API_BASE =
  process.env.INTERNAL_API_BASE ||
  "https://billpayment-api-v2.azurewebsites.net/api/v1";

let cachedToken: string | null = null;

const getInternalToken = async (): Promise<string> => {
  if (cachedToken) return cachedToken;

  const res = await axios.post(`${API_BASE}/auth/token`);
  cachedToken = res.data.token;
  return cachedToken!;
};

export const handleIntent = async (intent: ParsedIntent) => {
  const subscriber_no = intent.subscriber_no ?? "123456";
  const month = intent.month;
  const amount = intent.amount;

  const token = await getInternalToken();
  const headers = { Authorization: `Bearer ${token}` };

  if (intent.intent === "QUERY_BILL") {
    const res = await axios.get(`${API_BASE}/bill`, {
      headers,
      params: { subscriber_no, month },
    });

    return {
      message: "Here is your bill information.",
      data: res.data,
    };
  }

  if (intent.intent === "QUERY_BILL_DETAILED") {
    const res = await axios.get(`${API_BASE}/bill/detailed`, {
      headers,
      params: {
        subscriber_no,
        month,
        page: 1,
        limit: 5,
      },
    });

    return {
      message: "Here is the detailed breakdown of your bill.",
      data: res.data,
    };
  }


  if (intent.intent === "PAY_BILL") {
    const billRes = await axios.get(`${API_BASE}/bill`, {
      headers,
      params: { subscriber_no, month },
    });

    const bill = billRes.data;

    if (bill.paid_status === "paid") {
      return {
        message: "This bill is already paid.",
        data: bill,
      };
    }

    const payRes = await axios.post(
      `${API_BASE}/pay`,
      {
        subscriber_no,
        month,
        amount,
      },
      { headers }
    );

    return {
      message: payRes.data.message,
      data: payRes.data.bill,
    };
  }

  return {
    message: "Sorry, I couldn't understand your request.",
    data: null,
  };
};
