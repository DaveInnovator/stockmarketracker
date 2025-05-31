import React, { useState, useEffect } from 'react';
import { searchStock } from '../services/stockApi';
import { Link } from 'react-router-dom';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('watchlist')) || [];
    setWatchlist(stored);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await searchStock(query);
      if (res.length === 0) {
        setError('No stocks found');
      }
      setResults(res);
    } catch (err) {
      setError('Failed to fetch search results');
    }
    setLoading(false);
  };

  const toggleWatchlist = (symbol) => {
    let updated;
    if (watchlist.includes(symbol)) {
      updated = watchlist.filter((s) => s !== symbol);
    } else {
      updated = [...watchlist, symbol];
    }
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">🔍 Search Stocks</h2>
      <form onSubmit={handleSearch} className="mb-6 flex space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value.toUpperCase())}
          placeholder="Enter stock symbol or name"
          className="flex-grow p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 rounded"
          disabled={loading}
        >
          Search
        </button>
      </form>

      {loading && <p className="text-gray-400">Searching...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid md:grid-cols-2 gap-4">
        {results.map((stock, idx) => (
          <div
            key={idx}
            className="bg-gray-800 p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <Link to={`/stock/${stock.symbol}`}>
                <p className="text-lg font-semibold">{stock.symbol}</p>
              </Link>
              <p className="text-sm text-gray-400">{stock.name}</p>
              <p className="text-sm text-gray-400">{stock.region}</p>
            </div>
            <button
              onClick={() => toggleWatchlist(stock.symbol)}
              className="text-yellow-400 text-2xl select-none"
              aria-label={watchlist.includes(stock.symbol) ? 'Remove from watchlist' : 'Add to watchlist'}
              title={watchlist.includes(stock.symbol) ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              {watchlist.includes(stock.symbol) ? '★' : '☆'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
