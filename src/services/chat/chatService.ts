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
  const safeIntent = {
    intent: intent.intent,
    month: intent.month ?? "2024-01",
    subscriber_no: intent.subscriber_no ?? "123456",
    amount: intent.amount ?? null,
  };

  const token = await getInternalToken();
  const headers = { Authorization: `Bearer ${token}` };

  /**
   * =========================
   * QUERY BILL
   * =========================
   */
  if (safeIntent.intent === "QUERY_BILL") {
    const res = await axios.get(`${API_BASE}/bill`, {
      headers,
      params: {
        subscriber_no: safeIntent.subscriber_no,
        month: safeIntent.month,
      },
    });

    if (!res.data || res.data.length === 0) {
      return {
        message: `No bill found for ${safeIntent.month}.`,
        data: null,
      };
    }

    const bill = res.data[0];

    return {
      message:
        bill.status === "Paid"
          ? "Your bill is already paid."
          : "Here is your bill information.",
      data: bill,
    };
  }

  /**
   * =========================
   * QUERY BILL DETAILED
   * =========================
   */
  if (safeIntent.intent === "QUERY_BILL_DETAILED") {
    const res = await axios.get(`${API_BASE}/bill/detailed`, {
      headers,
      params: {
        subscriber_no: safeIntent.subscriber_no,
        month: safeIntent.month,
        page: 1,
        limit: 5,
      },
    });

    if (!res.data || res.data.length === 0) {
      return {
        message: `No detailed bill found for ${safeIntent.month}.`,
        data: null,
      };
    }

    return {
      message: "Here is the detailed breakdown of your bill.",
      data: res.data,
    };
  }

  /**
   * =========================
   * QUERY UNPAID BILLS (BONUS)
   * =========================
   */
  if (safeIntent.intent === "QUERY_UNPAID_BILLS") {
    const res = await axios.get(`${API_BASE}/bank/bill`, {
      headers,
      params: {
        subscriber_no: safeIntent.subscriber_no,
      },
    });

    if (!res.data || res.data.length === 0) {
      return {
        message: "You have no unpaid bills.",
        data: [],
      };
    }

    return {
      message: "Here are your unpaid bills.",
      data: res.data,
    };
  }

  /**
   * =========================
   * PAY BILL
   * =========================
   */
  if (safeIntent.intent === "PAY_BILL") {
    const billRes = await axios.get(`${API_BASE}/bill`, {
      headers,
      params: {
        subscriber_no: safeIntent.subscriber_no,
        month: safeIntent.month,
      },
    });

    if (!billRes.data || billRes.data.length === 0) {
      return {
        message: "No bill found to pay.",
        data: null,
      };
    }

    const bill = billRes.data[0];

    if (bill.status === "Paid") {
      return {
        message: "This bill is already paid.",
        data: bill,
      };
    }

    const payRes = await axios.post(
      `${API_BASE}/pay`,
      {
        subscriber_no: safeIntent.subscriber_no,
        month: safeIntent.month,
        amount: safeIntent.amount,
      },
      { headers }
    );

    return {
      message:
        payRes.data.remaining_amount && payRes.data.remaining_amount > 0
          ? `Partial payment successful. Remaining amount: ${payRes.data.remaining_amount} TL`
          : "Payment successful.",
      data: payRes.data,
    };
  }

  /**
   * =========================
   * FALLBACK
   * =========================
   */
  return {
    message: "Sorry, I couldn't understand your request.",
    data: null,
  };
};
