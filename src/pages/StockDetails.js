import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStockQuote, getStockHistory } from '../services/stockApi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';


const StockDetails = () => {
  const { symbol } = useParams();
  const [quote, setQuote] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const q = await getStockQuote(symbol);
      const h = await getStockHistory(symbol);
      setQuote(q);
      setHistory(h);
      setLoading(false);
    };
    loadData();
  }, [symbol]);

  if (loading) return <p className="text-white p-6">Loading stock data...</p>;
  if (!quote) return <p className="text-red-500 p-6">Stock data not found.</p>;

  const chartData =
    history?.labels?.length > 0
      ? history.labels.map((label, i) => ({
          date: label,
          price: history.prices[i],
        }))
      : [];

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-4">{quote['01. symbol']} Details</h2>
      <p className="mb-2 text-lg">Price: ${quote['05. price']}</p>
      <p className="mb-2 text-sm text-gray-400">
        Change: {quote['09. change']} ({quote['10. change percent']})
      </p>
      <p className="mb-6 text-sm text-gray-400">
        Last Updated: {quote['07. latest trading day']}
      </p>

      {chartData.length > 0 ? (
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">7-Day Price Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-gray-400">No chart data available.</p>
      )}
    </div>
  );
};

export default StockDetails;
