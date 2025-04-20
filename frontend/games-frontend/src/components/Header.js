// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom'; // If using React Router

const Header = () => {
  return (
    <header className="common-header">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
};

export default Header;