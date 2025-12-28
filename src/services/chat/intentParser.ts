import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface ParsedIntent {
  intent: "QUERY_BILL" | "QUERY_BILL_DETAILED" | "PAY_BILL";
  month?: string;
  subscriber_no: string;
  amount?: number;
}

export const parseIntent = async (message: string): Promise<ParsedIntent> => {
  const prompt = `
You are an intent parser for a telecom bill payment system.

Supported intents:
- QUERY_BILL
- QUERY_BILL_DETAILED
- PAY_BILL

Month mapping:
January/Ocak=01
February/Şubat=02
March/Mart=03
April/Nisan=04
May/Mayıs=05
June/Haziran=06
July/Temmuz=07
August/Ağustos=08
September/Eylül=09
October/Ekim=10
November/Kasım=11
December/Aralık=12

Rules:
- If a month name is mentioned, convert it to YYYY-MM
- Use year 2025 unless another year is explicitly mentioned
- If no month is mentioned, set month to null
- subscriber_no is always "123456"
- Extract payment amount if present

User message:
"${message}"

Return ONLY raw JSON.

JSON format:
{
  "intent": "QUERY_BILL | QUERY_BILL_DETAILED | PAY_BILL",
  "month": "YYYY-MM | null",
  "subscriber_no": "123456",
  "amount": number | null
}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.choices[0].message.content!;
  return JSON.parse(raw.trim());
};
