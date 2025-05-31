// src/pages/Watchlist.js
import React, { useEffect, useState } from 'react';
import { getStockQuote } from '../services/stockApi';
import { Link } from 'react-router-dom';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('watchlist')) || [];
    setWatchlist(saved);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (watchlist.length === 0) {
        setLoading(false);
        return;
      }

      const data = await Promise.all(
        watchlist.map(async (symbol) => await getStockQuote(symbol))
      );

      setQuotes(data.filter(Boolean));
      setLoading(false);
    };

    fetchData();
  }, [watchlist]);

  const removeFromWatchlist = (symbol) => {
    const updated = watchlist.filter((item) => item !== symbol);
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">⭐ Your Watchlist</h2>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : quotes.length === 0 ? (
        <p className="text-gray-400">No stocks in watchlist yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {quotes.map((quote, idx) => (
            <div
              key={idx}
              className="bg-gray-800 p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <Link to={`/stock/${quote['01. symbol']}`}>
                  <p className="text-lg font-semibold">{quote['01. symbol']}</p>
                </Link>
                <p className="text-sm text-gray-400">Price: ${quote['05. price']}</p>
                <p className="text-sm text-gray-400">
                  Change: {quote['09. change']} ({quote['10. change percent']})
                </p>
              </div>
              <button
                onClick={() => removeFromWatchlist(quote['01. symbol'])}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
