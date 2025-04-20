import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Box, Link } from '@mui/material';

const Mines = () => {
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [minesCount, setMinesCount] = useState(10);
  const [boardSize, setBoardSize] = useState(10);
  const [firstClick, setFirstClick] = useState(true);
  const [flagsPlaced, setFlagsPlaced] = useState(0);
  const [lives, setLives] = useState(10);
  const [highScore, setHighScore] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Initialize the board
  useEffect(() => {
    initializeBoard();
  }, [boardSize, minesCount]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive && !gameOver && !gameWon) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, gameOver, gameWon]);

  const initializeBoard = () => {
    const newBoard = Array(boardSize).fill().map(() => 
      Array(boardSize).fill().map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      }))
    );
    setBoard(newBoard);
    setGameOver(false);
    setGameWon(false);
    setFirstClick(true);
    setFlagsPlaced(0);
    setLives(10);
    setScore(0);
    setTimer(0);
    setTimerActive(false);
  };

  const placeMines = (clickRow, clickCol) => {
    const newBoard = [...board];
    let minesPlaced = 0;

    while (minesPlaced < minesCount) {
      const row = Math.floor(Math.random() * boardSize);
      const col = Math.floor(Math.random() * boardSize);

      // Don't place mine on first click position or where one already exists
      if ((row !== clickRow || col !== clickCol) && !newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate adjacent mines for each cell
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (!newBoard[row][col].isMine) {
          newBoard[row][col].adjacentMines = countAdjacentMines(newBoard, row, col);
        }
      }
    }

    setBoard(newBoard);
    setTimerActive(true);
  };

  const countAdjacentMines = (board, row, col) => {
    let count = 0;
    for (let r = Math.max(0, row - 1); r <= Math.min(boardSize - 1, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(boardSize - 1, col + 1); c++) {
        if (board[r][c].isMine) count++;
      }
    }
    return count;
  };

  const handleCellClick = (row, col) => {
    if (gameOver || gameWon || board[row][col].isFlagged || board[row][col].isRevealed) {
      return;
    }

    if (firstClick) {
      placeMines(row, col);
      setFirstClick(false);
    }

    const newBoard = [...board];
    
    if (newBoard[row][col].isMine) {
      // Deduct a life
      const newLives = lives - 1;
      setLives(newLives);
      
      if (newLives <= 0) {
        // Game over - reveal all mines
        revealAllMines(newBoard);
        setGameOver(true);
        setTimerActive(false);
        updateHighScore();
      } else {
        // Just reveal this mine and continue
        newBoard[row][col].isRevealed = true;
      }
      
      setBoard(newBoard);
      return;
    }

    revealCell(newBoard, row, col);
    
    // Update score based on revealed cells
    const revealedCount = newBoard.flat().filter(cell => cell.isRevealed && !cell.isMine).length;
    setScore(revealedCount * 10);
    
    // Check if player has won
    if (checkWinCondition(newBoard)) {
      setGameWon(true);
      setTimerActive(false);
      updateHighScore();
    }

    setBoard(newBoard);
  };

  const revealCell = (board, row, col) => {
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize || 
        board[row][col].isRevealed || board[row][col].isFlagged) {
      return;
    }

    board[row][col].isRevealed = true;

    // If it's an empty cell (no adjacent mines), reveal adjacent cells
    if (board[row][col].adjacentMines === 0) {
      for (let r = Math.max(0, row - 1); r <= Math.min(boardSize - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(boardSize - 1, col + 1); c++) {
          if (r !== row || c !== col) {
            revealCell(board, r, c);
          }
        }
      }
    }
  };

  const revealAllMines = (board) => {
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (board[row][col].isMine) {
          board[row][col].isRevealed = true;
        }
      }
    }
  };

  const handleRightClick = (e, row, col) => {
    e.preventDefault();
    if (gameOver || gameWon || board[row][col].isRevealed) return;

    const newBoard = [...board];
    if (!newBoard[row][col].isFlagged && flagsPlaced < minesCount) {
      newBoard[row][col].isFlagged = true;
      setFlagsPlaced(flagsPlaced + 1);
    } else if (newBoard[row][col].isFlagged) {
      newBoard[row][col].isFlagged = false;
      setFlagsPlaced(flagsPlaced - 1);
    }
    setBoard(newBoard);
  };

  const checkWinCondition = (board) => {
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (!board[row][col].isMine && !board[row][col].isRevealed) {
          return false;
        }
      }
    }
    return true;
  };

  const updateHighScore = () => {
    const calculatedScore = score + (minesCount * 100) - (timer * 2);
    if (calculatedScore > highScore) {
      setHighScore(calculatedScore);
    }
  };

  const getCellColor = (adjacentMines) => {
    const colors = [
      'transparent', // 0
      '#1976d2',     // 1
      '#388e3c',     // 2
      '#d32f2f',     // 3
      '#7b1fa2',     // 4
      '#ff8f00',     // 5
      '#00796b',     // 6
      '#212121',     // 7
      '#616161'      // 8
    ];
    return colors[adjacentMines];
  };

  const changeDifficulty = (size, mines) => {
    setBoardSize(size);
    setMinesCount(mines);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
          MINESWEEPER
        </h2>
      </div>

      {/* Content */}
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
          <div style={{ marginBottom: "1rem" }}>
            <button
              onClick={() => changeDifficulty(10, 10)}
              style={{
                margin: "0 0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: boardSize === 10 ? "#1976d2" : "#f5f5f5",
                color: boardSize === 10 ? "white" : "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Easy (10×10)
            </button>
            <button
              onClick={() => changeDifficulty(15, 40)}
              style={{
                margin: "0 0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: boardSize === 15 ? "#1976d2" : "#f5f5f5",
                color: boardSize === 15 ? "white" : "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Medium (15×15)
            </button>
            <button
              onClick={() => changeDifficulty(20, 80)}
              style={{
                margin: "0 0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: boardSize === 20 ? "#1976d2" : "#f5f5f5",
                color: boardSize === 20 ? "white" : "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Hard (20×20)
            </button>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '1rem',
            fontSize: '1.2rem'
          }}>
            <div>Lives: ❤️ × {lives}</div>
            <div>Time: ⏱️ {formatTime(timer)}</div>
            <div>Score: 🏆 {score}</div>
            <div>High Score: 🏅 {highScore}</div>
          </div>

          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            {gameOver ? "Game Over!" : gameWon ? "You Win!" : `Mines: ${minesCount - flagsPlaced}`}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${boardSize}, 30px)`,
              gap: "2px",
              justifyItems: "center",
              alignItems: "center",
              margin: "0 auto",
              backgroundColor: "#ccc",
              padding: "4px",
              borderRadius: "8px"
            }}
          >
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                  style={{
                    width: "30px",
                    height: "30px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    backgroundColor: cell.isRevealed ? "#f5f5f5" : "#d3d3d3",
                    border: "2px solid",
                    borderColor: cell.isRevealed ? "#bbb" : "#fff #999 #999 #fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: gameOver || gameWon ? "not-allowed" : "pointer",
                    userSelect: "none"
                  }}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? (
                      "💣"
                    ) : cell.adjacentMines > 0 ? (
                      <span style={{ color: getCellColor(cell.adjacentMines) }}>
                        {cell.adjacentMines}
                      </span>
                    ) : null
                  ) : cell.isFlagged ? (
                    "🚩"
                  ) : null}
                </div>
              ))
            )}
          </div>

          <button
            onClick={initializeBoard}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#1976d2",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            New Game
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Mines;