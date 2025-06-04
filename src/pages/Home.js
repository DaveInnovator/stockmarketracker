import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStockQuote } from '../services/stockApi';
import StockChatbot from '../components/StockNewsFlash';  // <-- import the chatbot component

const popularStocks = ['AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA'];

const Home = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleWatchlist = (symbol) => {
    setWatchlist((prev) => {
      let updated;
      if (prev.includes(symbol)) {
        updated = prev.filter((s) => s !== symbol);
      } else {
        updated = [...prev, symbol];
      }
      localStorage.setItem('watchlist', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const data = await Promise.all(
          popularStocks.map(async (symbol) => {
            const quote = await getStockQuote(symbol);
            return quote;
          })
        );
        setQuotes(data);
      } catch (error) {
        console.error('Error fetching quotes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-6">📈 Popular Stocks</h2>

      {loading ? (
        <p className="text-gray-400">Fetching stock data...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {quotes.map((quote, idx) => (
            <div
              key={idx}
              className="bg-gray-800 p-4 rounded shadow hover:bg-gray-700 transition flex justify-between items-center"
            >
              <div>
                <Link to={`/stock/${quote['01. symbol']}`}>
                  <p className="text-lg font-semibold">{quote['01. symbol']}</p>
                </Link>
                <p className="text-sm text-gray-400">Price: ${quote['05. price']}</p>
                <p className="text-sm text-gray-400">
                  Change: {quote['09. change']} ({quote['10. change percent']})
                </p>
                <p className="text-sm text-gray-400">
                  Last Updated: {quote['07. latest trading day']}
                </p>
              </div>

              <button
                onClick={() => toggleWatchlist(quote['01. symbol'])}
                className="ml-4 px-4 py-1 bg-yellow-500 hover:bg-yellow-600 cursor-pointer text-black font-medium rounded"
              >
                {watchlist.includes(quote['01. symbol'])
                  ? 'Remove from Watchlist'
                  : 'Add to Watchlist'}
              </button>
            </div>
          ))}
        </div>
      )}

      
      <div className="mt-10">
        <StockChatbot />
      </div>
    </div>
  );
};

export default Home;