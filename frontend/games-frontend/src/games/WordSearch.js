import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Box, Link } from '@mui/material';

// Random letter generator
const randomLetter = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters[Math.floor(Math.random() * 26)];
};

// Word Search Game Component
const WordSearch = () => {
  const [grid, setGrid] = useState([]);
  const [allWords] = useState([
    'CAT', 'DOG', 'MONKEY', 'TIGER', 'PANDA',
    'KOALA', 'RABBIT', 'SNAIL', 'SNAKE', 'CROCODILE',
    'FISH', 'APPLE', 'BANANA', 'ROBOT', 'SHIP',
    'PLANE', 'BOAT', 'HOUSE', 'ROSE', 'LOTUS',
    'APACHE', 'DOCKER', 'REACTJS', 'HTML','NODEJS'
  ]);
  const [words, setWords] = useState([]);
  const [foundWords, setFoundWords] = useState(new Set());
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [wordFound, setWordFound] = useState(null);
  const [foundWordPositions, setFoundWordPositions] = useState([]);
  const [hintWord, setHintWord] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const gridSize = 15;
  const MAX_GENERATION_ATTEMPTS = 10;

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    setIsLoading(true);
    const selectedWords = selectRandomWords();
    setWords(selectedWords);
    generateGrid(selectedWords);
    setIsLoading(false);
  };

  const selectRandomWords = () => {
    // Filter words that are too long for the grid
    const suitableWords = allWords.filter(word => word.length <= gridSize);
    return [...suitableWords]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(8, suitableWords.length)); // Limit to 8 words max
  };

  const generateGrid = (selectedWords, attempt = 0) => {
    let newGrid = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => randomLetter())
    );
    
    if (attempt >= MAX_GENERATION_ATTEMPTS) {
      console.error("Failed to generate grid after maximum attempts");
      setGrid(newGrid);
      return;
    }

    if (!placeWordsInGrid(newGrid, selectedWords)) {
      // Try again with new words if placement fails
      const newSelectedWords = selectRandomWords();
      setWords(newSelectedWords);
      generateGrid(newSelectedWords, attempt + 1);
      return;
    }
    
    setGrid(newGrid);
    setFoundWords(new Set());
    setFoundWordPositions([]);
    setSelectedLetters([]);
  };

  const placeWordsInGrid = (grid, selectedWords) => {
    const directions = [
      [0, 1],   // Horizontal
      [1, 0],    // Vertical
      [1, 1],    // Diagonal down-right
      [1, -1]    // Diagonal down-left
    ];

    for (const word of selectedWords) {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 50;

      while (!placed && attempts < maxAttempts) {
        attempts++;
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const [dx, dy] = direction;

        const startX = getStartPosition(dx, word.length, gridSize);
        const startY = getStartPosition(dy, word.length, gridSize, dx === 1 && dy === -1);

        if (canPlaceWord(grid, word, startX, startY, dx, dy)) {
          placeWord(grid, word, startX, startY, dx, dy);
          placed = true;
        }
      }

      if (!placed) {
        console.warn(`Failed to place word: ${word}`);
        return false;
      }
    }
    return true;
  };

  const getStartPosition = (delta, wordLength, gridSize, isDownLeft = false) => {
    if (delta === 0) {
      return Math.floor(Math.random() * gridSize);
    }
    if (isDownLeft) {
      return Math.floor(Math.random() * (gridSize - wordLength)) + wordLength - 1;
    }
    return Math.floor(Math.random() * (gridSize - wordLength + 1));
  };

  const canPlaceWord = (grid, word, startX, startY, dx, dy) => {
    for (let i = 0; i < word.length; i++) {
      const x = startX + i * dx;
      const y = startY + i * dy;
      
      // Check if position is within grid bounds
      if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
        return false;
      }
      
      const currentCell = grid[x][y];
      if (currentCell !== word[i] && currentCell !== randomLetter()) {
        return false;
      }
    }
    return true;
  };

  const placeWord = (grid, word, startX, startY, dx, dy) => {
    for (let i = 0; i < word.length; i++) {
      const x = startX + i * dx;
      const y = startY + i * dy;
      grid[x][y] = word[i];
    }
  };

  const handleLetterClick = (x, y) => {
    const position = { x, y };
    const isAlreadySelected = selectedLetters.some(pos => pos.x === x && pos.y === y);

    if (isAlreadySelected) {
      // Deselect if clicked again
      setSelectedLetters(selectedLetters.filter(pos => !(pos.x === x && pos.y === y)));
      return;
    }

    if (selectedLetters.length === 0) {
      // First selection
      setSelectedLetters([position]);
      return;
    }

    const lastPos = selectedLetters[selectedLetters.length - 1];
    const isAdjacent = Math.abs(x - lastPos.x) <= 1 && Math.abs(y - lastPos.y) <= 1;

    if (!isAdjacent) {
      // Start new selection if not adjacent
      setSelectedLetters([position]);
      return;
    }

    // Check if new selection continues in same direction
    if (selectedLetters.length > 1) {
      const firstPos = selectedLetters[0];
      const secondPos = selectedLetters[1];
      const dx = secondPos.x - firstPos.x;
      const dy = secondPos.y - firstPos.y;

      if (x - lastPos.x !== dx || y - lastPos.y !== dy) {
        setSelectedLetters([position]);
        return;
      }
    }

    // Add to selection
    const newSelection = [...selectedLetters, position];
    setSelectedLetters(newSelection);

    // Check if selected letters form a word
    checkForWord(newSelection);
  };

  const checkForWord = (selection) => {
    const selectedWord = selection.map(pos => grid[pos.x][pos.y]).join('');
    
    if (words.includes(selectedWord)) {
      const newFoundWords = new Set(foundWords).add(selectedWord);
      setFoundWords(newFoundWords);
      setFoundWordPositions([...foundWordPositions, ...selection]);
      setSelectedLetters([]);
      setWordFound(selectedWord);
      
      setTimeout(() => {
        setWordFound(null);
        if (newFoundWords.size === words.length) {
          setTimeout(() => alert('🎉 Congratulations! You found all words!'), 500);
        }
      }, 2000);
    }
  };

  const isPartOfFoundWord = (x, y) => {
    return foundWordPositions.some(pos => pos.x === x && pos.y === y);
  };

  const giveHint = () => {
    const unfoundWords = words.filter(word => !foundWords.has(word));
    if (unfoundWords.length === 0) return;
    
    const hint = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
    setHintWord(hint);
    setShowHint(true);
    
    setTimeout(() => setShowHint(false), 3000);
  };

  const resetGame = () => {
    initializeGame();
  };

  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <div key={rowIndex} style={{ display: 'flex' }}>
        {row.map((cell, cellIndex) => {
          const isSelected = selectedLetters.some(pos => pos.x === rowIndex && pos.y === cellIndex);
          const isFound = isPartOfFoundWord(rowIndex, cellIndex);
          const isHint = showHint && hintWord && hintWord.includes(cell) && !foundWords.has(hintWord);

          return (
            <div
              key={cellIndex}
              onClick={() => handleLetterClick(rowIndex, cellIndex)}
              style={{
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #ccc',
                borderRadius: '12px',
                cursor: 'pointer',
                backgroundColor: isSelected
                  ? '#D3D3D3'
                  : isFound
                    ? '#a5d6a7'
                    : isHint
                      ? '#ffecb3'
                      : '#ffffff',
                fontWeight: isFound || isHint ? 'bold' : 'normal',
                margin: '2px',
                transition: 'all 0.2s ease',
                transform: isSelected ? 'scale(1.1)' : 'scale(1)'
              }}
            >
              {cell}
            </div>
          );
        })}
      </div>
    ));
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
          WORD SEARCH
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
        {isLoading ? (
          <div style={{ color: 'white', fontSize: '1.5rem' }}>Loading game...</div>
        ) : (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              padding: "2rem",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
              width: "fit-content",
              maxWidth: "90%"
            }}
          >
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              Find these words: {words.join(', ')}
            </h2>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '20px 0'
            }}>
              <div style={{
                border: '2px solid #ccc',
                borderRadius: '12px',
                padding: '10px',
                backgroundColor: '#ffffff'
              }}>
                {renderGrid()}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button
                onClick={giveHint}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#1565c0';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#1976d2';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Get Hint
              </button>

              <button
                onClick={resetGame}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e52e71',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#c2185b';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#e52e71';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                New Game
              </button>
            </div>

            {showHint && hintWord && (
              <div style={{
                marginTop: '10px',
                color: '#ff9800',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}>
                Hint: Look for "{hintWord}"
              </div>
            )}

            <div style={{ marginTop: "20px" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Found Words:</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {[...foundWords].map((word, index) => (
                  <li
                    key={index}
                    style={{
                      color: "green",
                      fontSize: "1.2rem",
                      margin: "5px 0",
                      fontWeight: "bold"
                    }}
                  >
                    {word}
                  </li>
                ))}
              </ul>
            </div>

            {wordFound && (
              <div style={{
                marginTop: '20px',
                color: 'blue',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                animation: 'fadeInOut 2s ease-in-out'
              }}>
                You found: {wordFound}!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default WordSearch;