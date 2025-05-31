import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import StockDetails from './pages/StockDetails';
import Navbar from './components/Navbar';
import Watchlist from './pages/Watchlist';
function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
      <Route path="/stock/:symbol" element={<StockDetails />} />
      <Route path="/watchlist" element={<Watchlist />} />
      </Routes>
    </Router>
  );
}

export default App;
