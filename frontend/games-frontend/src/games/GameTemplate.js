// src/games/GameTemplate.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const GameTemplate = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="game-container">
      <div className="game-header">
        <IconButton 
          onClick={() => navigate('/')}
          aria-label="back"
          size="large"
          sx={{ color: 'white' }}
        >
          <ArrowBackIcon fontSize="inherit" />
        </IconButton>
        <h2>{title}</h2>
      </div>
      
      <div className="game-content">
        {/* Your game implementation goes here */}
      </div>
    </div>
  );
};

export default GameTemplate;