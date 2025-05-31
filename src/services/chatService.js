import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

// Limit chat history length to last 10 messages to save tokens
const MAX_HISTORY = 10;

export const askChatbot = async (messages) => {
  try {
    const recentMessages = messages.slice(-MAX_HISTORY);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: recentMessages,
    });
    return { text: response.choices[0].message.content, error: null };
  } catch (error) {
    if (error.status === 429) {
      return { text: null, error: "Rate limit exceeded. Please wait a moment." };
    }
    console.error("Chatbot error:", error);
    return { text: null, error: "Sorry, something went wrong." };
  }
};