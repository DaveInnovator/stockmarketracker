import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ padding: '1rem', background: '#1e1e1e', color: '#fff' }}>
      <Link to="/" style={{ marginRight: '20px' }}>Home</Link>
      <Link to="/search" style={{ marginRight: '20px' }}>Search</Link>
      <Link to="/watchlist">Watchlist</Link>
    </nav>
  );
};

export default Navbar;
