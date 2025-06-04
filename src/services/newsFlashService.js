import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const fetchStockNewsFlash = async (topic = "stock market") => {
  try {
    const prompt = `Provide a brief and current news flash or summary about ${topic}, focused on important market movements, trends, and relevant stock updates. Keep it concise and informative.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a financial news summarizer." },
        { role: "user", content: prompt },
      ],
      max_tokens: 250,
    });

    return { text: response.choices[0].message.content, error: null };
  } catch (error) {
    console.error("News flash error:", error);
    return { text: null, error: "Failed to fetch news flash. Please try again later." };
  }
};
