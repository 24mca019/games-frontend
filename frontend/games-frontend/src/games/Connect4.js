// src/games/Connect4.js
import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Box, Link } from '@mui/material';

const Connect4 = () => {
  const ROWS = 6;
  const COLS = 7;
  const [board, setBoard] = useState(Array(ROWS).fill().map(() => Array(COLS).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winCounts, setWinCounts] = useState({ red: 0, yellow: 0 });
  const [showRanking, setShowRanking] = useState(false);
  const [finalSequences, setFinalSequences] = useState({ red: 0, yellow: 0 });
  const [showWinModal, setShowWinModal] = useState(false);
  const rankingRef = useRef(null);

  // Close ranking when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rankingRef.current && !rankingRef.current.contains(event.target)) {
        // Check if the click is not on the ranking button
        if (!event.target.closest('button[onclick*="setShowRanking"]')) {
          setShowRanking(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const countAllSequences = () => {
    const counts = { red: 0, yellow: 0 };

    // Check horizontal sequences
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        const sequence = [
          board[row][col],
          board[row][col + 1],
          board[row][col + 2],
          board[row][col + 3]
        ];
        if (sequence.every(cell => cell === 'red')) counts.red++;
        if (sequence.every(cell => cell === 'yellow')) counts.yellow++;
      }
    }

    // Check vertical sequences
    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 0; col < COLS; col++) {
        const sequence = [
          board[row][col],
          board[row + 1][col],
          board[row + 2][col],
          board[row + 3][col]
        ];
        if (sequence.every(cell => cell === 'red')) counts.red++;
        if (sequence.every(cell => cell === 'yellow')) counts.yellow++;
      }
    }

    // Check diagonal (top-left to bottom-right)
    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        const sequence = [
          board[row][col],
          board[row + 1][col + 1],
          board[row + 2][col + 2],
          board[row + 3][col + 3]
        ];
        if (sequence.every(cell => cell === 'red')) counts.red++;
        if (sequence.every(cell => cell === 'yellow')) counts.yellow++;
      }
    }

    // Check diagonal (bottom-left to top-right)
    for (let row = 3; row < ROWS; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        const sequence = [
          board[row][col],
          board[row - 1][col + 1],
          board[row - 2][col + 2],
          board[row - 3][col + 3]
        ];
        if (sequence.every(cell => cell === 'red')) counts.red++;
        if (sequence.every(cell => cell === 'yellow')) counts.yellow++;
      }
    }

    return counts;
  };

  useEffect(() => {
    const checkWinner = () => {
      // Check horizontal
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS - 3; col++) {
          if (
            board[row][col] &&
            board[row][col] === board[row][col + 1] &&
            board[row][col] === board[row][col + 2] &&
            board[row][col] === board[row][col + 3]
          ) {
            return board[row][col];
          }
        }
      }

      // Check vertical
      for (let row = 0; row < ROWS - 3; row++) {
        for (let col = 0; col < COLS; col++) {
          if (
            board[row][col] &&
            board[row][col] === board[row + 1][col] &&
            board[row][col] === board[row + 2][col] &&
            board[row][col] === board[row + 3][col]
          ) {
            return board[row][col];
          }
        }
      }

      // Check diagonal (top-left to bottom-right)
      for (let row = 0; row < ROWS - 3; row++) {
        for (let col = 0; col < COLS - 3; col++) {
          if (
            board[row][col] &&
            board[row][col] === board[row + 1][col + 1] &&
            board[row][col] === board[row + 2][col + 2] &&
            board[row][col] === board[row + 3][col + 3]
          ) {
            return board[row][col];
          }
        }
      }

      // Check diagonal (bottom-left to top-right)
      for (let row = 3; row < ROWS; row++) {
        for (let col = 0; col < COLS - 3; col++) {
          if (
            board[row][col] &&
            board[row][col] === board[row - 1][col + 1] &&
            board[row][col] === board[row - 2][col + 2] &&
            board[row][col] === board[row - 3][col + 3]
          ) {
            return board[row][col];
          }
        }
      }

      return null;
    };

    const winner = checkWinner();
    if (winner) {
      setWinner(winner);
      setWinCounts(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
      setGameOver(true);
      setShowWinModal(true);
      return;
    }

    // Only check for draw if there's no winner
    if (board.every(row => row.every(cell => cell))) {
      const counts = countAllSequences();
      setFinalSequences(counts);
      
      if (counts.red > counts.yellow) {
        setWinner('red');
        setWinCounts(prev => ({ ...prev, red: prev.red + 1 }));
      } else if (counts.yellow > counts.red) {
        setWinner('yellow');
        setWinCounts(prev => ({ ...prev, yellow: prev.yellow + 1 }));
      } else {
        setWinner(null); // Pure draw
      }
      
      setGameOver(true);
      setShowWinModal(true);
    }
  }, [board]);

  const handleColumnClick = (col) => {
    if (gameOver) return;

    for (let row = ROWS - 1; row >= 0; row--) {
      if (!board[row][col]) {
        const newBoard = [...board];
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'red' ? 'yellow' : 'red');
        break;
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(ROWS).fill().map(() => Array(COLS).fill(null)));
    setCurrentPlayer(winner === 'red' ? 'yellow' : 'red');
    setWinner(null);
    setGameOver(false);
    setFinalSequences({ red: 0, yellow: 0 });
    setShowWinModal(false);
  };

  const getStatus = () => {
    if (gameOver) {
      if (winner) {
        if (finalSequences.red > 0 || finalSequences.yellow > 0) {
          return `Winner: ${winner === 'red' ? 'Red' : 'Yellow'} (${finalSequences[winner]} sequences)`;
        }
        return `Winner: ${winner === 'red' ? 'Red' : 'Yellow'}`;
      }
      return "It's a Draw!";
    }
    return `Next Player: ${currentPlayer === 'red' ? 'Red' : 'Yellow'}`;
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
      {showWinModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '16px',
            textAlign: 'center',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '2rem', marginTop: 0, color: winner === 'red' ? '#ff5252' : '#ffeb3b' }}>
              {winner ? `${winner === 'red' ? 'Red' : 'Yellow'} Player Wins!` : "It's a Draw!"}
            </h2>
            {winner && (finalSequences.red > 0 || finalSequences.yellow > 0) && (
              <p style={{ fontSize: '1.2rem' }}>
                With {finalSequences[winner]} winning sequences
              </p>
            )}
            <div style={{ margin: '2rem 0' }}>
              <div style={{
                fontSize: '1.5rem',
                display: 'inline-block',
                padding: '1rem 2rem',
                backgroundColor: winner === 'red' ? '#ff5252' : (winner === 'yellow' ? '#ffeb3b' : '#ddd'),
                color: winner === 'yellow' ? '#333' : '#fff',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}>
                {winner ? `${winner === 'red' ? 'RED' : 'YELLOW'} WINS!` : 'DRAW!'}
              </div>
            </div>
            <button
              onClick={resetGame}
              style={{
                padding: "0.8rem 1.5rem",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#1976d2",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 'bold',
                marginTop: '1rem'
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* New Header */}
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
          CONNECT 4
        </h2>
      </div>

      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem"
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            padding: "2rem",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
            width: "fit-content",
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: "1.5rem", margin: 0 }}>{getStatus()}</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={resetGame}
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.9rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                New Game
              </button>
              <button
                onClick={() => setShowRanking(!showRanking)}
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.9rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#f0f0f0",
                  color: "#333",
                  cursor: "pointer"
                }}
              >
                Ranking...
              </button>
            </div>
          </div>

          {showRanking && (
            <div ref={rankingRef} style={{
              position: 'absolute',
              right: '2rem',
              top: '5rem',
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: 10
            }}>
              <h3 style={{ marginTop: 0 }}>Total Wins</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '20px', height: '20px', backgroundColor: '#ff5252', borderRadius: '50%' }} />
                  <span>Red Wins: {winCounts.red}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '20px', height: '20px', backgroundColor: '#ffeb3b', borderRadius: '50%' }} />
                  <span>Yellow Wins: {winCounts.yellow}</span>
                </div>
              </div>
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gap: '10px',
              marginBottom: '10px'
            }}>
              {Array(COLS).fill().map((_, colIndex) => (
                <button
                  key={`header-${colIndex}`}
                  onClick={() => handleColumnClick(colIndex)}
                  disabled={gameOver}
                  style={{
                    width: '50px',
                    height: '30px',
                    backgroundColor: '#f0f0f0',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: gameOver ? 'not-allowed' : 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}
                >
                  {colIndex + 1}
                </button>
              ))}
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridTemplateRows: `repeat(${ROWS}, 1fr)`,
              gap: '10px',
              backgroundColor: '#1976d2',
              padding: '20px',
              borderRadius: '16px'
            }}>
              {board.map((row, rowIndex) => 
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: cell ? (cell === 'red' ? '#ff5252' : '#ffeb3b') : '#fff',
                      borderRadius: '50%',
                      border: '2px solid #1976d2',
                      boxShadow: cell ? 'inset 0 0 10px rgba(0,0,0,0.2)' : 'none'
                    }}
                  />
                ))
              )}
            </div>
          </div>

          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#ff5252',
                borderRadius: '50%'
              }} />
              <span>Red</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#ffeb3b',
                borderRadius: '50%'
              }} />
              <span>Yellow</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Footer */}
      <Footer />
    </div>
  );
};

export default Connect4;