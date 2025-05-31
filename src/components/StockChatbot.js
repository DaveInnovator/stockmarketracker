import React, { useState, useEffect } from "react";
import { askChatbot } from "../services/chatService";

const StockChatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful stock assistant." },
  ]);
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const [isCooldown, setIsCooldown] = useState(false);

  const cooldownTime = 10000; // 10 seconds cooldown

  const handleSend = async () => {
    if (!input.trim() || isCooldown) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setError(null);
    setResponse("...");

    const { text, error } = await askChatbot(newMessages);

    if (error) {
      setError(error);
      setResponse("");
      if (error.includes("Rate limit")) {
        setIsCooldown(true);
      }
    } else {
      setResponse(text);
      setMessages((prev) => [...prev, { role: "assistant", content: text }]);
    }
  };

  // Cooldown effect to reset after 10 seconds
  useEffect(() => {
    if (isCooldown) {
      const timer = setTimeout(() => {
        setIsCooldown(false);
        setError(null);
      }, cooldownTime);

      return () => clearTimeout(timer);
    }
  }, [isCooldown]);

  return (
    <div className="p-4 bg-gray-800 rounded text-white max-w-md mx-auto mt-4">
      <div className="mb-2">
        <textarea
          rows="3"
          className="w-full p-2 rounded bg-gray-700 text-white resize-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isCooldown ? "Please wait before sending more messages..." : "Ask me about stocks..."}
          disabled={isCooldown}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={isCooldown || !input.trim()}
        className={`px-4 py-2 rounded font-semibold ${
          isCooldown || !input.trim()
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Send
      </button>
      {error && (
        <p className="mt-2 text-red-400 font-semibold">{error}</p>
      )}
      {response && (
        <div className="mt-4 p-3 bg-gray-700 rounded whitespace-pre-wrap">
          {response}
        </div>
      )}
    </div>
  );
};

export default StockChatbot;
