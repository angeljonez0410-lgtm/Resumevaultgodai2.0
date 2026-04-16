import OpenAI from "openai";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey });
}

export async function invokeLLM(prompt: string, options?: { jsonSchema?: Record<string, unknown> }) {
  const openai = getOpenAIClient();

  if (options?.jsonSchema) {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4096,
    });
    const text = res.choices[0]?.message?.content || "{}";
    return JSON.parse(text);
  }

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 4096,
  });
  return res.choices[0]?.message?.content || "";
}

export async function invokeLLMPremium(prompt: string) {
  const openai = getOpenAIClient();

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 8192,
  });
  return res.choices[0]?.message?.content || "";
}
