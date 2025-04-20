// src/components/LoadingFallback.js
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingFallback = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <CircularProgress />
    </div>
  );
};

export default LoadingFallback;