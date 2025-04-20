// src/components/BackgroundImage.js
import React from 'react';

const BackgroundImage = ({ imageUrl, children }) => {
  const style = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    width: '100%'
  };

  return (
    <div style={style}>
      {children}
    </div>
  );
};

export default BackgroundImage;