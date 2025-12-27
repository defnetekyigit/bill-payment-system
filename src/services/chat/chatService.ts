import axios from "axios";
import { ParsedIntent } from "./intentParser";

const API_BASE =
  process.env.INTERNAL_API_BASE || "https://billpayment-api-cnh8fubqbegrf5cm.francecentral-01.azurewebsites.net/api/v1";

let cachedToken: string | null = null;

export const getInternalToken = async (): Promise<string> => {
  if (cachedToken) return cachedToken;

  const response = await axios.post(`${API_BASE}/auth/token`);
  cachedToken = response.data.token;
  return cachedToken!;
};

export const handleIntent = async (intent: ParsedIntent) => {
  const safeIntent = {
    intent: intent.intent,
    month: intent.month ?? "2023-01",
    subscriber_no: intent.subscriber_no ?? "123456",
    amount: intent.amount ?? null,
  };

  const token = await getInternalToken();
  const headers = { Authorization: `Bearer ${token}` };

  let apiResponse;

  switch (safeIntent.intent) {
    case "QUERY_BILL":
      apiResponse = await axios.get(`${API_BASE}/bill`, {
        headers,
        params: {
          subscriber_no: safeIntent.subscriber_no,
          month: safeIntent.month,
        },
      });
      break;

    case "QUERY_BILL_DETAILED":
      apiResponse = await axios.get(`${API_BASE}/bill/detailed`, {
        headers,
        params: {
          subscriber_no: safeIntent.subscriber_no,
          month: safeIntent.month,
          page: 1,
          limit: 5,
        },
      });
      break;

    case "PAY_BILL":
      apiResponse = await axios.post(
        `${API_BASE}/pay`,
        {
          subscriber_no: safeIntent.subscriber_no,
          month: safeIntent.month,
          amount: safeIntent.amount,
        },
        { headers }
      );
      break;

    default:
      throw new Error("Unknown intent");
  }

  // 🔥 KRİTİK KISIM
  const data = Array.isArray(apiResponse.data)
    ? apiResponse.data[0]
    : apiResponse.data;

  return {
    message:
      safeIntent.intent === "PAY_BILL"
        ? "Payment processed successfully"
        : "Bill information retrieved",
    data,
  };
};
