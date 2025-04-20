import React, { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Box, Link } from '@mui/material';

const puzzles = [
  {
    initial: [
      ["5", "3", "", "", "7", "", "", "", ""],
      ["6", "", "", "1", "9", "5", "", "", ""],
      ["", "9", "8", "", "", "", "", "6", ""],
      ["8", "", "", "", "6", "", "", "", "3"],
      ["4", "", "", "8", "", "3", "", "", "1"],
      ["7", "", "", "", "2", "", "", "", "6"],
      ["", "6", "", "", "", "", "2", "8", ""],
      ["", "", "", "4", "1", "9", "", "", "5"],
      ["", "", "", "", "8", "", "", "7", "9"]
    ],
    solution: [
      ["5", "3", "4", "6", "7", "8", "9", "1", "2"],
      ["6", "7", "2", "1", "9", "5", "3", "4", "8"],
      ["1", "9", "8", "3", "4", "2", "5", "6", "7"],
      ["8", "5", "9", "7", "6", "1", "4", "2", "3"],
      ["4", "2", "6", "8", "5", "3", "7", "9", "1"],
      ["7", "1", "3", "9", "2", "4", "8", "5", "6"],
      ["9", "6", "1", "5", "3", "7", "2", "8", "4"],
      ["2", "8", "7", "4", "1", "9", "6", "3", "5"],
      ["3", "4", "5", "2", "8", "6", "1", "7", "9"]
    ]
  },
  {
    initial: [
      ["", "", "", "2", "6", "", "7", "", "1"],
      ["6", "8", "", "", "7", "", "", "9", ""],
      ["1", "9", "", "", "", "4", "5", "", ""],
      ["8", "2", "", "1", "", "", "", "4", ""],
      ["", "", "4", "6", "", "2", "9", "", ""],
      ["", "5", "", "", "", "3", "", "2", "8"],
      ["", "", "9", "3", "", "", "", "7", "4"],
      ["", "4", "", "", "5", "", "", "3", "6"],
      ["7", "", "3", "", "1", "8", "", "", ""]
    ],
    solution: [
      ["4", "3", "5", "2", "6", "9", "7", "8", "1"],
      ["6", "8", "2", "5", "7", "1", "4", "9", "3"],
      ["1", "9", "7", "8", "3", "4", "5", "6", "2"],
      ["8", "2", "6", "1", "9", "5", "3", "4", "7"],
      ["3", "7", "4", "6", "8", "2", "9", "1", "5"],
      ["9", "5", "1", "7", "4", "3", "6", "2", "8"],
      ["5", "1", "9", "3", "2", "6", "8", "7", "4"],
      ["2", "4", "8", "9", "5", "7", "1", "3", "6"],
      ["7", "6", "3", "4", "1", "8", "2", "5", "9"]
    ]
  },
  {
    initial: [
      ["", "2", "", "", "", "5", "", "9", ""],
      ["", "", "5", "2", "", "", "", "", ""],
      ["", "", "", "", "", "", "6", "", ""],
      ["5", "", "", "", "", "", "", "", "3"],
      ["", "", "", "", "9", "", "", "", ""],
      ["6", "", "", "", "", "", "", "", "4"],
      ["", "", "8", "", "", "", "", "", ""],
      ["", "", "", "", "", "6", "3", "", ""],
      ["", "3", "", "5", "", "", "", "7", ""]
    ],
    solution: [
      ["8", "2", "6", "3", "1", "5", "4", "9", "7"],
      ["3", "1", "5", "2", "6", "9", "7", "4", "8"],
      ["4", "7", "9", "8", "4", "7", "6", "3", "2"],
      ["5", "4", "2", "7", "8", "1", "9", "6", "3"],
      ["1", "8", "3", "6", "9", "4", "2", "5", "7"],
      ["6", "9", "7", "5", "2", "3", "1", "8", "4"],
      ["7", "6", "8", "4", "3", "2", "5", "1", "9"],
      ["2", "5", "1", "9", "7", "6", "3", "8", "6"],
      ["9", "3", "4", "5", "1", "8", "8", "7", "5"]
    ]
  },
  {
    initial: [
      ["", "", "4", "", "", "", "", "", ""],
      ["", "", "", "", "", "3", "", "8", "5"],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "2"],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "4", "", ""],
      ["", "", "", "", "7", "", "", "", ""],
      ["", "", "", "6", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""]
    ],
    solution: [
      ["2", "8", "4", "1", "5", "6", "3", "9", "7"],
      ["1", "9", "6", "2", "4", "3", "7", "8", "5"],
      ["3", "7", "5", "9", "8", "7", "2", "6", "1"],
      ["8", "1", "9", "4", "3", "5", "6", "7", "2"],
      ["4", "6", "2", "7", "1", "9", "5", "3", "8"],
      ["7", "5", "3", "8", "6", "2", "4", "1", "9"],
      ["6", "2", "8", "5", "7", "1", "9", "4", "3"],
      ["9", "4", "7", "6", "2", "8", "1", "5", "6"],
      ["5", "3", "1", "3", "9", "4", "8", "2", "6"]
    ]
  },
  {
    initial: [
      ["", "", "", "8", "", "1", "", "", ""],
      ["4", "", "", "", "", "", "", "", "7"],
      ["", "", "2", "", "", "", "5", "", ""],
      ["", "", "", "", "7", "", "", "", ""],
      ["", "1", "", "2", "", "6", "", "4", ""],
      ["", "", "", "", "9", "", "", "", ""],
      ["", "", "5", "", "", "", "6", "", ""],
      ["2", "", "", "", "", "", "", "", "1"],
      ["", "", "", "9", "", "7", "", "", ""]
    ],
    solution: [
      ["7", "5", "6", "8", "4", "1", "2", "9", "3"],
      ["4", "3", "1", "6", "2", "5", "8", "7", "7"],
      ["9", "8", "2", "7", "3", "6", "5", "1", "4"],
      ["5", "6", "9", "1", "7", "4", "3", "2", "8"],
      ["3", "1", "7", "2", "5", "6", "9", "4", "6"],
      ["8", "2", "4", "3", "9", "8", "1", "6", "5"],
      ["1", "9", "5", "4", "8", "3", "6", "5", "2"],
      ["2", "7", "8", "5", "6", "9", "4", "3", "1"],
      ["6", "4", "3", "9", "1", "7", "7", "8", "9"]
    ]
  },
  // 5 more puzzles to make it 10 total
  {
    initial: [
      ["", "", "6", "1", "", "", "", "", ""],
      ["", "8", "", "", "9", "", "", "3", ""],
      ["", "", "", "", "", "2", "", "", "6"],
      ["", "", "", "", "", "", "5", "", ""],
      ["", "5", "", "4", "", "9", "", "7", ""],
      ["", "", "2", "", "", "", "", "", ""],
      ["3", "", "", "7", "", "", "", "", ""],
      ["", "7", "", "", "6", "", "", "2", ""],
      ["", "", "", "", "", "5", "9", "", ""]
    ],
    solution: [
      ["4", "3", "6", "1", "5", "7", "2", "8", "9"],
      ["2", "8", "7", "6", "9", "4", "1", "3", "5"],
      ["5", "9", "1", "3", "8", "2", "4", "7", "6"],
      ["7", "6", "9", "2", "1", "8", "5", "4", "3"],
      ["1", "5", "3", "4", "2", "9", "6", "7", "8"],
      ["8", "4", "2", "5", "7", "6", "3", "9", "1"],
      ["3", "2", "5", "7", "4", "1", "8", "6", "9"],
      ["9", "7", "8", "8", "6", "3", "7", "2", "4"],
      ["6", "1", "4", "9", "3", "5", "9", "7", "2"]
    ]
  },
  {
    initial: [
      ["", "4", "", "", "", "", "", "", ""],
      ["", "", "1", "9", "", "", "5", "", ""],
      ["", "", "", "", "", "3", "", "6", "7"],
      ["", "", "", "", "6", "", "", "", ""],
      ["", "", "7", "", "", "", "3", "", ""],
      ["", "", "", "", "8", "", "", "", ""],
      ["7", "3", "", "4", "", "", "", "", ""],
      ["", "", "5", "", "", "9", "2", "", ""],
      ["", "", "", "", "", "", "", "1", ""]
    ],
    solution: [
      ["3", "4", "9", "7", "2", "6", "1", "5", "8"],
      ["6", "7", "1", "9", "4", "8", "5", "2", "3"],
      ["2", "5", "8", "1", "5", "3", "4", "6", "7"],
      ["1", "9", "3", "2", "6", "7", "8", "4", "5"],
      ["5", "8", "7", "5", "9", "4", "3", "7", "6"],
      ["4", "2", "6", "3", "8", "1", "7", "9", "2"],
      ["7", "3", "2", "4", "1", "5", "6", "8", "9"],
      ["8", "1", "5", "6", "7", "9", "2", "3", "4"],
      ["9", "6", "4", "8", "3", "2", "9", "1", "7"]
    ]
  },
  {
    initial: [
      ["", "", "", "", "", "", "", "8", ""],
      ["", "", "", "7", "", "", "", "", ""],
      ["", "6", "", "", "5", "", "4", "", ""],
      ["", "", "8", "", "", "1", "", "5", ""],
      ["", "", "", "", "3", "", "", "", ""],
      ["", "4", "", "6", "", "", "9", "", ""],
      ["", "", "3", "", "7", "", "", "2", ""],
      ["", "", "", "", "", "2", "", "", ""],
      ["", "9", "", "", "", "", "", "", ""]
    ],
    solution: [
      ["5", "7", "4", "2", "6", "9", "3", "8", "1"],
      ["3", "8", "1", "7", "4", "4", "2", "9", "6"],
      ["9", "6", "2", "1", "5", "3", "4", "7", "8"],
      ["6", "2", "8", "9", "7", "1", "4", "5", "3"],
      ["1", "5", "9", "8", "3", "4", "6", "2", "7"],
      ["7", "4", "3", "6", "2", "5", "9", "1", "8"],
      ["4", "1", "3", "5", "7", "8", "6", "2", "9"],
      ["8", "3", "7", "4", "9", "2", "1", "6", "5"],
      ["2", "9", "6", "3", "1", "7", "8", "4", "2"]
    ]
  },
  {
    initial: [
      ["", "5", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "6", "2", "", ""],
      ["", "", "7", "1", "", "", "", "8", ""],
      ["", "", "", "", "9", "", "", "", "4"],
      ["", "", "", "3", "", "7", "", "", ""],
      ["6", "", "", "", "8", "", "", "", ""],
      ["", "1", "", "", "", "5", "8", "", ""],
      ["", "", "9", "4", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "6", ""]
    ],
    solution: [
      ["8", "5", "4", "7", "2", "8", "6", "3", "1"],
      ["3", "9", "1", "8", "5", "6", "2", "4", "7"],
      ["2", "6", "7", "1", "3", "4", "5", "8", "9"],
      ["7", "2", "8", "6", "9", "1", "3", "5", "4"],
      ["9", "4", "5", "3", "2", "7", "1", "6", "8"],
      ["6", "3", "1", "5", "8", "2", "4", "7", "9"],
      ["4", "1", "2", "9", "6", "5", "8", "7", "3"],
      ["5", "8", "9", "4", "7", "3", "6", "2", "1"],
      ["1", "7", "3", "2", "4", "8", "9", "6", "5"]
    ]
  },
  {
    initial: [
      ["", "", "", "6", "", "", "", "", ""],
      ["", "7", "", "", "", "9", "", "2", ""],
      ["", "", "5", "", "8", "", "1", "", ""],
      ["", "", "", "", "", "5", "", "", ""],
      ["", "", "", "7", "", "8", "", "", ""],
      ["", "", "", "4", "", "", "", "", ""],
      ["", "", "2", "", "3", "", "8", "", ""],
      ["", "6", "", "9", "", "", "", "1", ""],
      ["", "", "", "", "", "1", "", "", "3"]
    ],
    solution: [
      ["2", "8", "1", "6", "7", "4", "3", "5", "9"],
      ["6", "7", "4", "3", "5", "9", "6", "2", "8"],
      ["3", "9", "5", "2", "8", "6", "1", "4", "7"],
      ["8", "3", "9", "1", "2", "5", "4", "7", "6"],
      ["1", "2", "6", "7", "9", "8", "5", "3", "4"],
      ["7", "5", "4", "4", "6", "3", "2", "8", "1"],
      ["9", "4", "2", "5", "3", "7", "8", "6", "2"],
      ["5", "6", "8", "9", "4", "2", "7", "1", "3"],
      ["4", "1", "7", "8", "6", "1", "9", "2", "3"]
    ]
  }
];

const Sudoku = () => {
  const [selected, setSelected] = useState(null);
  const [grid, setGrid] = useState([]);
  const [message, setMessage] = useState("");
  const [showWinModal, setShowWinModal] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * puzzles.length);
    const { initial, solution } = puzzles[randomIndex];
    setSelected({ initial, solution });
    setGrid(initial.map(row => [...row]));
  }, []);

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

  if (!selected) return <p>Loading...</p>;

  const handleChange = (r, c, value) => {
    if (!/^[1-9]?$/.test(value)) return;
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = value;
    setGrid(newGrid);
    setMessage("");
  };

  const isFixed = (r, c) => selected.initial[r][c] !== "";

  const checkAnswer = () => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] !== selected.solution[r][c]) {
          setMessage("❌ Incorrect! Keep trying.");
          return;
        }
      }
    }
    setMessage("✅ Correct! You solved it!");
    setShowWinModal(true);
  };

  const resetGame = () => {
    setGrid(selected.initial.map(row => [...row]));
    setMessage("");
    setShowWinModal(false);
  };

  const newGame = () => {
    const randomIndex = Math.floor(Math.random() * puzzles.length);
    const { initial, solution } = puzzles[randomIndex];
    setSelected({ initial, solution });
    setGrid(initial.map(row => [...row]));
    setMessage("");
    setShowWinModal(false);
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
      {/* Win Modal */}
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
              color: '#4CAF50'
            }}>
              Puzzle Solved!
            </h2>
            <div style={{ margin: '2rem 0' }}>
              <div style={{
                fontSize: '1.5rem',
                display: 'inline-block',
                padding: '1rem 2rem',
                backgroundColor: '#4CAF50',
                color: '#fff',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}>
                CONGRATULATIONS!
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={newGame}
                style={{
                  padding: "0.8rem 1.5rem",
                  fontSize: "1rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 'bold'
                }}
              >
                New Game
              </button>
              <button
                onClick={resetGame}
                style={{
                  padding: "0.8rem 1.5rem",
                  fontSize: "1rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#f44336",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 'bold'
                }}
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Updated Header */}
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
          SUDOKU
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(9, 50px)",
              gridTemplateRows: "repeat(9, 50px)",
              gap: "1px",
              border: "3px solid #333",
              margin: "0 auto"
            }}
          >
            {grid.map((row, rIdx) =>
              row.map((val, cIdx) => {
                // Add thicker borders for 3x3 blocks
                const borderStyle = {
                  borderTop: rIdx % 3 === 0 ? "2px solid #333" : "1px solid #aaa",
                  borderLeft: cIdx % 3 === 0 ? "2px solid #333" : "1px solid #aaa",
                  borderRight: cIdx === 8 ? "2px solid #333" : "none",
                  borderBottom: rIdx === 8 ? "2px solid #333" : "none"
                };
                
                return (
                  <input
                    key={`${rIdx}-${cIdx}`}
                    type="text"
                    maxLength="1"
                    value={val}
                    onChange={e => handleChange(rIdx, cIdx, e.target.value)}
                    disabled={isFixed(rIdx, cIdx)}
                    style={{
                      width: "50px",
                      height: "50px",
                      textAlign: "center",
                      fontSize: "1.5rem",
                      fontWeight: isFixed(rIdx, cIdx) ? "bold" : "normal",
                      backgroundColor: isFixed(rIdx, cIdx) ? "#f0f0f0" : "#fff",
                      color: isFixed(rIdx, cIdx) ? "#333" : "#1976d2",
                      ...borderStyle,
                      outline: "none"
                    }}
                  />
                );
              })
            )}
          </div>

          <p style={{ 
            fontSize: "1.2rem", 
            margin: "1rem 0", 
            minHeight: "24px",
            color: message.includes("✅") ? "#4CAF50" : "#f44336"
          }}>
            {message}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              onClick={checkAnswer}
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#4CAF50",
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#45a049";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#4CAF50";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Check Solution
            </button>

            <button
              onClick={resetGame}
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#f44336",
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#d32f2f";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#f44336";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Reset
            </button>

            <button
              onClick={newGame}
              style={{
                padding: "0.75rem 1.5rem",
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
              New Puzzle
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Sudoku;