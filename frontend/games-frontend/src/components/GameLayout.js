// src/components/GameLayout.js
import React from 'react';
import { Link } from 'react-router-dom';
import './GameLayout.css';

const GameLayout = ({ gameName, children }) => {
  return (
    <div className="game-page-container">
      <header className="game-header">
        {/* Left side: Hizo link */}
        <Link to="/" className="hizo-name">
          Hizo
        </Link>
        
        {/* Right side: Game name */}
        <div className="game-title">{gameName}</div>
      </header>

      {/* Main content */}
      <div className="game-content">
        {children}
      </div>
    </div>
  );
};

export default GameLayout;
