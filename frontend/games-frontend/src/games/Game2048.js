import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Box, Link } from '@mui/material';

const Game2048 = () => {
  const [grid, setGrid] = useState(Array(4).fill().map(() => Array(4).fill(0)));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [keepPlaying, setKeepPlaying] = useState(false);

  // Initialize the game
  const initializeGame = useCallback(() => {
    const newGrid = Array(4).fill().map(() => Array(4).fill(0));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setKeepPlaying(false);
  }, []);

  // Add a random tile (2 or 4) to an empty cell
  const addRandomTile = (grid) => {
    const emptyCells = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (grid[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  // Check if the game is over
  const checkGameOver = (grid) => {
    // Check if there are any empty cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (grid[row][col] === 0) {
          return false;
        }
      }
    }

    // Check if there are any possible merges
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = grid[row][col];
        // Check right
        if (col < 3 && grid[row][col + 1] === current) return false;
        // Check down
        if (row < 3 && grid[row + 1][col] === current) return false;
      }
    }

    return true;
  };

  // Check if the player has won (reached 2048)
  const checkWin = (grid) => {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (grid[row][col] === 2048) {
          return true;
        }
      }
    }
    return false;
  };

  // Move tiles left
  const moveLeft = (grid) => {
    const newGrid = JSON.parse(JSON.stringify(grid));
    let moved = false;
    let newScore = score;

    for (let row = 0; row < 4; row++) {
      // Remove zeros and merge identical tiles
      const nonZeros = newGrid[row].filter(val => val !== 0);
      const merged = [];
      let i = 0;

      while (i < nonZeros.length) {
        if (i < nonZeros.length - 1 && nonZeros[i] === nonZeros[i + 1]) {
          const mergedValue = nonZeros[i] * 2;
          merged.push(mergedValue);
          newScore += mergedValue;
          i += 2;
          moved = true;
        } else {
          merged.push(nonZeros[i]);
          i += 1;
        }
      }

      // Fill the rest with zeros
      while (merged.length < 4) {
        merged.push(0);
      }

      // Check if the row changed
      if (JSON.stringify(newGrid[row]) !== JSON.stringify(merged)) {
        moved = true;
      }

      newGrid[row] = merged;
    }

    return { newGrid, moved, newScore };
  };

  // Move tiles right
  const moveRight = (grid) => {
    const newGrid = JSON.parse(JSON.stringify(grid));
    let moved = false;
    let newScore = score;

    for (let row = 0; row < 4; row++) {
      // Remove zeros and merge identical tiles
      const nonZeros = newGrid[row].filter(val => val !== 0);
      const merged = [];
      let i = nonZeros.length - 1;

      while (i >= 0) {
        if (i > 0 && nonZeros[i] === nonZeros[i - 1]) {
          const mergedValue = nonZeros[i] * 2;
          merged.unshift(mergedValue);
          newScore += mergedValue;
          i -= 2;
          moved = true;
        } else {
          merged.unshift(nonZeros[i]);
          i -= 1;
        }
      }

      // Fill the rest with zeros
      while (merged.length < 4) {
        merged.unshift(0);
      }

      // Check if the row changed
      if (JSON.stringify(newGrid[row]) !== JSON.stringify(merged)) {
        moved = true;
      }

      newGrid[row] = merged;
    }

    return { newGrid, moved, newScore };
  };

  // Move tiles up
  const moveUp = (grid) => {
    const newGrid = JSON.parse(JSON.stringify(grid));
    let moved = false;
    let newScore = score;

    for (let col = 0; col < 4; col++) {
      // Get column values
      const column = [];
      for (let row = 0; row < 4; row++) {
        column.push(newGrid[row][col]);
      }

      // Remove zeros and merge identical tiles
      const nonZeros = column.filter(val => val !== 0);
      const merged = [];
      let i = 0;

      while (i < nonZeros.length) {
        if (i < nonZeros.length - 1 && nonZeros[i] === nonZeros[i + 1]) {
          const mergedValue = nonZeros[i] * 2;
          merged.push(mergedValue);
          newScore += mergedValue;
          i += 2;
          moved = true;
        } else {
          merged.push(nonZeros[i]);
          i += 1;
        }
      }

      // Fill the rest with zeros
      while (merged.length < 4) {
        merged.push(0);
      }

      // Check if the column changed
      for (let row = 0; row < 4; row++) {
        if (newGrid[row][col] !== merged[row]) {
          moved = true;
          newGrid[row][col] = merged[row];
        }
      }
    }

    return { newGrid, moved, newScore };
  };

  // Move tiles down
  const moveDown = (grid) => {
    const newGrid = JSON.parse(JSON.stringify(grid));
    let moved = false;
    let newScore = score;

    for (let col = 0; col < 4; col++) {
      // Get column values
      const column = [];
      for (let row = 0; row < 4; row++) {
        column.push(newGrid[row][col]);
      }

      // Remove zeros and merge identical tiles
      const nonZeros = column.filter(val => val !== 0);
      const merged = [];
      let i = nonZeros.length - 1;

      while (i >= 0) {
        if (i > 0 && nonZeros[i] === nonZeros[i - 1]) {
          const mergedValue = nonZeros[i] * 2;
          merged.unshift(mergedValue);
          newScore += mergedValue;
          i -= 2;
          moved = true;
        } else {
          merged.unshift(nonZeros[i]);
          i -= 1;
        }
      }

      // Fill the rest with zeros
      while (merged.length < 4) {
        merged.unshift(0);
      }

      // Check if the column changed
      for (let row = 0; row < 4; row++) {
        if (newGrid[row][col] !== merged[row]) {
          moved = true;
          newGrid[row][col] = merged[row];
        }
      }
    }

    return { newGrid, moved, newScore };
  };

  // Handle keyboard events
  const handleKeyDown = useCallback((e) => {
    if (gameOver && !keepPlaying) return;

    let moved = false;
    let newGrid = [...grid];
    let newScore = score;

    switch (e.key) {
      case 'ArrowLeft':
        ({ newGrid, moved, newScore } = moveLeft(grid));
        break;
      case 'ArrowRight':
        ({ newGrid, moved, newScore } = moveRight(grid));
        break;
      case 'ArrowUp':
        ({ newGrid, moved, newScore } = moveUp(grid));
        break;
      case 'ArrowDown':
        ({ newGrid, moved, newScore } = moveDown(grid));
        break;
      default:
        return;
    }

    if (moved) {
      addRandomTile(newGrid);
      setGrid(newGrid);
      setScore(newScore);

      // Update high score
      if (newScore > highScore) {
        setHighScore(newScore);
      }

      // Check for win
      if (!gameWon && !keepPlaying && checkWin(newGrid)) {
        setGameWon(true);
      }

      // Check for game over
      if (checkGameOver(newGrid)) {
        setGameOver(true);
      }
    }
  }, [grid, score, gameOver, gameWon, keepPlaying, highScore]);

  // Set up event listeners
  useEffect(() => {
    initializeGame();
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [initializeGame, handleKeyDown]);

  // Get tile color based on value
  const getTileColor = (value) => {
    const colors = {
      0: '#cdc1b4',
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
      4096: '#3c3a32',
      8192: '#3c3a32'
    };
    return colors[value] || '#3c3a32';
  };

  // Get tile text color based on value
  const getTextColor = (value) => {
    return value <= 4 ? '#776e65' : '#f9f6f2';
  };

  // Get font size based on value
  const getFontSize = (value) => {
    if (value < 100) return '2.5rem';
    if (value < 1000) return '2rem';
    return '1.5rem';
  };

  const Footer = () => {
    return (
      <Box 
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '20px',
          marginTop: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          backdropFilter: 'blur(5px)',
        }}
      >
        <Typography variant="body2" sx={{ marginBottom: '10px' }}>
          © {new Date().getFullYear()} HIZO Games - All rights reserved
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Link href="#" color="inherit" underline="hover">
            Terms of Service
          </Link>
          <Link href="#" color="inherit" underline="hover">
            Privacy Policy
          </Link>
          <Link href="#" color="inherit" underline="hover">
            Contact Us
          </Link>
        </Box>
        <Typography variant="caption" display="block" sx={{ marginTop: '10px', opacity: 0.8 }}>
          Made with ❤️ for game lovers
        </Typography>
      </Box>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/previews/008/311/935/non_2x/the-illustration-graphic-consists-of-abstract-background-with-a-blue-gradient-dynamic-shapes-composition-eps10-perfect-for-presentation-background-website-landing-page-wallpaper-vector.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        display: "flex",
        flexDirection: "column",
        padding: "20px"
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        marginBottom: '2rem',
        background: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        height: '80px'
      }}>
        <RouterLink 
          to="/" 
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'white',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            background: 'linear-gradient(90deg, #ff8a00, #e52e71, #1e90ff)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none'
          }}
        >
          HIZO
        </RouterLink>
        
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 600,
          color: 'white',
          textTransform: 'uppercase',
          fontFamily: "'Montserrat', sans-serif",
          margin: 0
        }}>
          2048
        </h2>
      </div>

      {/* Game Content */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          flexDirection: "column"
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            padding: "2rem",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
            width: "fit-content"
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            fontSize: '1.2rem',
            alignItems: 'center'
          }}>
            <div style={{ 
              background: '#bbada0',
              color: '#eee4da',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}>
              Score: {score}
            </div>
            <button
              onClick={initializeGame}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#8f7a66",
                color: "#f9f6f2",
                cursor: "pointer",
                fontWeight: 'bold'
              }}
            >
              New Game
            </button>
            <div style={{ 
              background: '#bbada0',
              color: '#eee4da',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}>
              High Score: {highScore}
            </div>
          </div>

          {/* Game board */}
          <div style={{
            background: '#bbada0',
            borderRadius: '6px',
            padding: '10px',
            position: 'relative',
            marginBottom: '1rem'
          }}>
            {/* Game over overlay */}
            {gameOver && !keepPlaying && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(238, 228, 218, 0.73)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '6px'
              }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: '#776e65',
                  marginBottom: '1rem'
                }}>
                  Game Over!
                </div>
                <button
                  onClick={initializeGame}
                  style={{
                    padding: "0.75rem 1.5rem",
                    fontSize: "1rem",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#8f7a66",
                    color: "#f9f6f2",
                    cursor: "pointer",
                    fontWeight: 'bold'
                  }}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Win overlay */}
            {gameWon && !keepPlaying && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(237, 194, 46, 0.5)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '6px'
              }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: '#f9f6f2',
                  marginBottom: '1rem',
                  textShadow: '0 2px 5px rgba(0, 0, 0, 0.5)'
                }}>
                  You Win!
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => setKeepPlaying(true)}
                    style={{
                      padding: "0.75rem 1.5rem",
                      fontSize: "1rem",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: "#8f7a66",
                      color: "#f9f6f2",
                      cursor: "pointer",
                      fontWeight: 'bold'
                    }}
                  >
                    Keep Playing
                  </button>
                  <button
                    onClick={initializeGame}
                    style={{
                      padding: "0.75rem 1.5rem",
                      fontSize: "1rem",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: "#f67c5f",
                      color: "#f9f6f2",
                      cursor: "pointer",
                      fontWeight: 'bold'
                    }}
                  >
                    New Game
                  </button>
                </div>
              </div>
            )}

            {/* Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridGap: '10px',
              position: 'relative'
            }}>
              {/* Background cells */}
              {Array(16).fill().map((_, index) => (
                <div key={`bg-${index}`} style={{
                  width: '80px',
                  height: '80px',
                  background: 'rgba(238, 228, 218, 0.35)',
                  borderRadius: '3px'
                }} />
              ))}

              {/* Tiles */}
              {grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  cell !== 0 && (
                    <div
                      key={`tile-${rowIndex}-${colIndex}`}
                      style={{
                        position: 'absolute',
                        top: `${rowIndex * 90 + 10}px`,
                        left: `${colIndex * 90 + 10}px`,
                        width: '80px',
                        height: '80px',
                        background: getTileColor(cell),
                        borderRadius: '3px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: getFontSize(cell),
                        fontWeight: 'bold',
                        color: getTextColor(cell),
                        zIndex: 10,
                        transition: 'all 0.1s ease-in-out'
                      }}
                    >
                      {cell}
                    </div>
                  )
                ))
              ))}
            </div>
          </div>

          <div style={{ 
            color: '#776e65',
            textAlign: 'center',
            marginTop: '1rem'
          }}>
            <p>Use arrow keys to move the tiles. When two tiles with the same number touch, they merge into one!</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Game2048;