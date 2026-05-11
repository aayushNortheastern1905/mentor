import Groq from "groq-sdk";

let client: Groq | null = null;

function getClient() {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY not set");
    client = new Groq({ apiKey });
  }
  return client;
}

export async function generateJSON<T>(prompt: string): Promise<T> {
  const ai = getClient();
  const response = await ai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
  });
  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error("Empty response from Groq");
  return JSON.parse(text) as T;
}

export async function generateText(prompt: string): Promise<string> {
  const ai = getClient();
  const response = await ai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
  });
  return response.choices[0]?.message?.content ?? "";
}
