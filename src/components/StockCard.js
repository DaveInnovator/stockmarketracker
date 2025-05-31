import { Link } from 'react-router-dom';

const StockCard = ({ quote }) => {
  return (
    <Link to={`/stock/${quote['01. symbol']}`}>
      <div className="bg-gray-800 p-4 rounded shadow hover:bg-gray-700 transition cursor-pointer">
        <p className="text-lg font-semibold">{quote['01. symbol']}</p>
        <p className="text-sm text-gray-400">Price: ${quote['05. price']}</p>
        <p className="text-sm text-gray-400">
          Change: {quote['09. change']} ({quote['10. change percent']})
        </p>
        <p className="text-sm text-gray-400">
          Last Updated: {quote['07. latest trading day']}
        </p>
      </div>
    </Link>
  );
};

export default StockCard;
