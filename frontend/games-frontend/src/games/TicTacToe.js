import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Box, Link } from '@mui/material';

const TicTacToe = () => {
  const emptyBoard = Array(9).fill(null);
  const [board, setBoard] = useState(emptyBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);

  useEffect(() => {
    const calculatedWinner = calculateWinner(board);
    if (calculatedWinner) {
      setWinner(calculatedWinner);
      setGameOver(true);
      setShowWinModal(true);
    } else if (board.every(Boolean)) {
      setGameOver(true);
      setShowWinModal(true);
    }
  }, [board]);

  const handleClick = (index) => {
    if (board[index] || gameOver) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(emptyBoard);
    setIsXNext(true);
    setWinner(null);
    setGameOver(false);
    setShowWinModal(false);
  };

  const getStatus = () => {
    if (winner) return `Winner: ${winner}`;
    if (gameOver) return "It's a Draw!";
    return `Next Player: ${isXNext ? "X" : "O"}`;
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
      {/* Winner Modal */}
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
            <h2 style={{ 
              fontSize: '2rem', 
              marginTop: 0, 
              color: winner === 'X' ? '#1976d2' : '#e52e71'
            }}>
              {winner ? `${winner} Player Wins!` : "It's a Draw!"}
            </h2>
            <div style={{ margin: '2rem 0' }}>
              <div style={{
                fontSize: '1.5rem',
                display: 'inline-block',
                padding: '1rem 2rem',
                backgroundColor: winner === 'X' ? '#1976d2' : (winner === 'O' ? '#e52e71' : '#ddd'),
                color: '#fff',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}>
                {winner ? `${winner} WINS!` : 'DRAW!'}
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
          TIC TAC TOE
        </h2>
      </div>

      {/* Game Content */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
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
            width: "fit-content"
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{getStatus()}</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
              justifyItems: "center",
              alignItems: "center",
              margin: "0 auto"
            }}
          >
            {board.map((cell, i) => (
              <button
                key={i}
                onClick={() => handleClick(i)}
                style={{
                  width: "80px",
                  height: "80px",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  backgroundColor: "#ffffff",
                  border: "2px solid #ccc",
                  borderRadius: "12px",
                  cursor: cell || gameOver ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  color: cell === "X" ? "#1976d2" : "#e52e71"
                }}
                onMouseOver={(e) => {
                  if (!cell && !gameOver) {
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "none";
                }}
              >
                {cell}
              </button>
            ))}
          </div>

          <button
            onClick={resetGame}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#1976d2",
              color: "#fff",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#1565c0";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#1976d2";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Reset Game
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

function calculateWinner(board) {
  const winLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let line of winLines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

export default TicTacToe;