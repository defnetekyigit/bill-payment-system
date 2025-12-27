import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface ParsedIntent {
  intent: "QUERY_BILL" | "QUERY_BILL_DETAILED" | "PAY_BILL" | "QUERY_UNPAID_BILLS";
  month: string;
  subscriber_no: string;
  amount?: number;
}

export const parseIntent = async (message: string): Promise<ParsedIntent> => {
  const prompt = `
You are an intent parser for a bill payment system.

User message: "${message}"

Return ONLY raw JSON.
Do NOT use markdown.
Do NOT wrap the response in \`\`\`.
Do NOT add explanations.

JSON format:
{
  "intent": "QUERY_BILL | QUERY_BILL_DETAILED | PAY_BILL | QUERY_UNPAID_BILLS",
  "month": "YYYY-MM",
  "subscriber_no": "123456",
  "amount": number | null
}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });
  const raw = response.choices[0].message.content!;

  const cleaned = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
};
