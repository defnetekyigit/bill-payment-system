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
- QUERY_BILL: User wants to see bill summary
- QUERY_BILL_DETAILED: User wants bill breakdown/details
- PAY_BILL: User wants to pay a bill

Rules:
- If user mentions "detail", "breakdown", use QUERY_BILL_DETAILED
- If user mentions "pay", "payment", use PAY_BILL
- Otherwise use QUERY_BILL
- Month must be in YYYY-MM format if mentioned
- If no month is mentioned, set month to null
- subscriber_no is always "123456"
- Extract payment amount if user mentions it

User message:
"${message}"

Return ONLY valid raw JSON.
Do NOT use markdown.
Do NOT add explanations.

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
