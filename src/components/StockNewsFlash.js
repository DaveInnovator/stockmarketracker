import React, { useState } from "react";
import { fetchStockNewsFlash } from "../services/newsFlashService";

const StockNewsFlash = () => {
  const [topic, setTopic] = useState(""); // e.g., user can type "TSLA" or "crypto"
  const [newsFlash, setNewsFlash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchNews = async () => {
    setLoading(true);
    setError(null);
    setNewsFlash("");

    const query = topic.trim() || "stock market";
    const { text, error } = await fetchStockNewsFlash(query);

    if (error) {
      setError(error);
    } else {
      setNewsFlash(text);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-800 rounded text-white max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-3">AI Stock Market News Flash</h2>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter stock ticker or topic (optional)"
        className="w-full p-2 rounded bg-gray-700 text-white mb-3"
      />
      <button
        onClick={handleFetchNews}
        disabled={loading}
        className={`w-full py-2 rounded font-semibold ${
          loading ? "bg-gray-500 cursor-not-allowed" : "bg-yellow-600 text-black cursor-pointer"
        }`}
      >
        {loading ? "Fetching news..." : "Get News Flash"}
      </button>

      {error && <p className="mt-4 text-red-400 font-semibold">{error}</p>}

      {newsFlash && (
        <div className="mt-6 p-4 bg-gray-700 rounded whitespace-pre-wrap">
          {newsFlash}
        </div>
      )}
    </div>
  );
};

export default StockNewsFlash;
