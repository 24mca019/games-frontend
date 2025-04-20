import React, { useState, useEffect, useCallback } from 'react';

const Crossword = () => {
  // Enhanced crossword data with proper intersections
  const crosswordData = {
    across: {
      1: {
        clue: "Markup language for web pages",
        answer: "HTML",
        row: 0,
        col: 0,
      },
      4: {
        clue: "Style sheet language",
        answer: "CSS",
        row: 2,
        col: 0,
      },
      6: {
        clue: "JavaScript runtime environment",
        answer: "NODE",
        row: 4,
        col: 1,
      },
      7: {
        clue: "Front-end JavaScript library",
        answer: "REACT",
        row: 6,
        col: 0,
      },
    },
    down: {
      2: {
        clue: "Programming language known for its simplicity",
        answer: "PYTHON",
        row: 0,
        col: 2,
      },
      3: {
        clue: "NoSQL database",
        answer: "MONGO",
        row: 0,
        col: 4,
      },
      5: {
        clue: "Version control system",
        answer: "GIT",
        row: 2,
        col: 3,
      },
    },
  };

  const [grid, setGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedClue, setSelectedClue] = useState(null);
  const [direction, setDirection] = useState('across');
  const [solvedWords, setSolvedWords] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);

  // Initialize the grid with proper word intersections
  const initializeGrid = useCallback(() => {
    const newGrid = Array(8).fill().map(() => Array(8).fill({ 
      letter: '', 
      isBlack: true,
      number: null,
      across: null,
      down: null,
      acrossIndex: null,
      downIndex: null
    }));
    
    // Helper function to check if cell is empty or has matching letter
    const canPlaceLetter = (row, col, letter) => {
      const cell = newGrid[row][col];
      return cell.isBlack || (cell.letter === '' || cell.letter === letter);
    };

    // Place across words first
    Object.entries(crosswordData.across).forEach(([num, word]) => {
      const { row, col, answer } = word;
      
      // Check if word can be placed
      for (let i = 0; i < answer.length; i++) {
        if (!canPlaceLetter(row, col + i, answer[i])) {
          console.error(`Cannot place across word ${num} at ${row},${col}`);
          return;
        }
      }
      
      // Place the word
      for (let i = 0; i < answer.length; i++) {
        newGrid[row][col + i] = {
          ...newGrid[row][col + i],
          letter: answer[i], // Initialize with correct letter for intersections
          isBlack: false,
          number: i === 0 ? num : newGrid[row][col + i].number,
          across: word,
          acrossIndex: i,
        };
      }
    });

    // Place down words, respecting intersections
    Object.entries(crosswordData.down).forEach(([num, word]) => {
      const { row, col, answer } = word;
      
      // Check if word can be placed
      for (let i = 0; i < answer.length; i++) {
        if (!canPlaceLetter(row + i, col, answer[i])) {
          console.error(`Cannot place down word ${num} at ${row},${col}`);
          return;
        }
      }
      
      // Place the word
      for (let i = 0; i < answer.length; i++) {
        newGrid[row + i][col] = {
          ...newGrid[row + i][col],
          letter: answer[i], // Initialize with correct letter for intersections
          isBlack: false,
          number: i === 0 ? num : newGrid[row + i][col].number,
          down: word,
          downIndex: i,
        };
      }
    });

    // Clear letters for user input (keep only intersections)
    const userGrid = newGrid.map(row => 
      row.map(cell => ({
        ...cell,
        letter: cell.isBlack ? '' : (cell.across && cell.down ? cell.letter : '')
      }))
    );

    setGrid(userGrid);
    setSelectedCell(null);
    setSelectedClue(null);
    setSolvedWords([]);
    setGameWon(false);
    setShowWinModal(false);
  }, []);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  const handleCellClick = (row, col) => {
    const cell = grid[row][col];
    if (cell.isBlack) return;

    // Toggle direction if clicking the same cell with both directions
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      if (cell.across && cell.down) {
        setDirection(prev => prev === 'across' ? 'down' : 'across');
        setSelectedClue(prev => prev === cell.across ? cell.down : cell.across);
      }
      return;
    }

    // Select new cell
    setSelectedCell({ row, col });
    
    // Determine direction based on available words
    if (direction === 'across' && cell.across) {
      setSelectedClue(cell.across);
    } else if (direction === 'down' && cell.down) {
      setSelectedClue(cell.down);
    } else if (cell.across) {
      setDirection('across');
      setSelectedClue(cell.across);
    } else if (cell.down) {
      setDirection('down');
      setSelectedClue(cell.down);
    }
  };

  const handleKeyDown = (e) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    const cell = grid[row][col];
    const key = e.key.toUpperCase();

    // Handle letter input
    if (/^[A-Z]$/.test(key)) {
      const newGrid = [...grid];
      newGrid[row][col] = { ...newGrid[row][col], letter: key };
      setGrid(newGrid);

      // Move to next cell
      moveToNextCell();
      checkWordCompletion();
    }
    // Handle backspace
    else if (e.key === 'Backspace') {
      const newGrid = [...grid];
      newGrid[row][col] = { ...newGrid[row][col], letter: '' };
      setGrid(newGrid);

      // Move to previous cell
      moveToPreviousCell();
    }
    // Handle arrow keys
    else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      handleArrowKey(e.key);
    }
    // Handle tab to switch direction
    else if (e.key === 'Tab') {
      e.preventDefault();
      if (cell.across && cell.down) {
        setDirection(prev => prev === 'across' ? 'down' : 'across');
        setSelectedClue(prev => prev === cell.across ? cell.down : cell.across);
      }
    }
  };

  const moveToNextCell = () => {
    if (!selectedCell || !selectedClue) return;

    const { row, col } = selectedCell;
    let nextRow = row;
    let nextCol = col;

    if (direction === 'across') {
      nextCol = col + 1;
      // Check if next cell is part of the same word
      if (nextCol >= grid[0].length || !grid[row][nextCol].across || grid[row][nextCol].across !== selectedClue) {
        // Find next word in this direction
        const nextWord = findNextWord();
        if (nextWord) {
          nextRow = direction === 'across' ? nextWord.row : nextWord.row;
          nextCol = direction === 'across' ? nextWord.col : nextWord.col;
          setSelectedClue(nextWord);
        }
      }
    } else {
      nextRow = row + 1;
      // Check if next cell is part of the same word
      if (nextRow >= grid.length || !grid[nextRow][col].down || grid[nextRow][col].down !== selectedClue) {
        // Find next word in this direction
        const nextWord = findNextWord();
        if (nextWord) {
          nextRow = direction === 'down' ? nextWord.row : nextWord.row;
          nextCol = direction === 'down' ? nextWord.col : nextWord.col;
          setSelectedClue(nextWord);
        }
      }
    }

    if (nextRow < grid.length && nextCol < grid[0].length && !grid[nextRow][nextCol].isBlack) {
      setSelectedCell({ row: nextRow, col: nextCol });
    }
  };

  const moveToPreviousCell = () => {
    if (!selectedCell || !selectedClue) return;

    const { row, col } = selectedCell;
    let prevRow = row;
    let prevCol = col;

    if (direction === 'across') {
      prevCol = col - 1;
      // Check if previous cell is part of the same word
      if (prevCol < 0 || !grid[row][prevCol].across || grid[row][prevCol].across !== selectedClue) {
        // Find previous word in this direction
        const prevWord = findPreviousWord();
        if (prevWord) {
          prevRow = direction === 'across' ? prevWord.row : prevWord.row;
          prevCol = direction === 'across' ? 
            prevWord.col + prevWord.answer.length - 1 : 
            prevWord.col;
          setSelectedClue(prevWord);
        }
      }
    } else {
      prevRow = row - 1;
      // Check if previous cell is part of the same word
      if (prevRow < 0 || !grid[prevRow][col].down || grid[prevRow][col].down !== selectedClue) {
        // Find previous word in this direction
        const prevWord = findPreviousWord();
        if (prevWord) {
          prevRow = direction === 'down' ? 
            prevWord.row + prevWord.answer.length - 1 : 
            prevWord.row;
          prevCol = prevWord.col;
          setSelectedClue(prevWord);
        }
      }
    }

    if (prevRow >= 0 && prevCol >= 0 && !grid[prevRow][prevCol].isBlack) {
      setSelectedCell({ row: prevRow, col: prevCol });
    }
  };

  const findNextWord = () => {
    const words = direction === 'across' ? 
      Object.values(crosswordData.across).sort((a, b) => a.row - b.row || a.col - b.col) : 
      Object.values(crosswordData.down).sort((a, b) => a.col - b.col || a.row - b.row);
    
    const currentIndex = words.findIndex(word => word === selectedClue);
    if (currentIndex < words.length - 1) {
      return words[currentIndex + 1];
    }
    return words[0]; // Wrap around to first word
  };

  const findPreviousWord = () => {
    const words = direction === 'across' ? 
      Object.values(crosswordData.across).sort((a, b) => a.row - b.row || a.col - b.col) : 
      Object.values(crosswordData.down).sort((a, b) => a.col - b.col || a.row - b.row);
    
    const currentIndex = words.findIndex(word => word === selectedClue);
    if (currentIndex > 0) {
      return words[currentIndex - 1];
    }
    return words[words.length - 1]; // Wrap around to last word
  };

  const handleArrowKey = (key) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    let newRow = row;
    let newCol = col;

    switch (key) {
      case 'ArrowUp':
        newRow = Math.max(0, row - 1);
        break;
      case 'ArrowDown':
        newRow = Math.min(grid.length - 1, row + 1);
        break;
      case 'ArrowLeft':
        newCol = Math.max(0, col - 1);
        break;
      case 'ArrowRight':
        newCol = Math.min(grid[0].length - 1, col + 1);
        break;
      default:
        return;
    }

    if (!grid[newRow][newCol].isBlack) {
      setSelectedCell({ row: newRow, col: newCol });
      
      // Update selected clue based on new cell and current direction
      const cell = grid[newRow][newCol];
      if (direction === 'across' && cell.across) {
        setSelectedClue(cell.across);
      } else if (direction === 'down' && cell.down) {
        setSelectedClue(cell.down);
      }
    }
  };

  const checkWordCompletion = () => {
    const newSolvedWords = [...solvedWords];
    let allWordsSolved = true;

    // Check across words
    Object.values(crosswordData.across).forEach(word => {
      const isSolved = word.answer.split('').every((char, i) => {
        return grid[word.row][word.col + i].letter === char;
      });

      if (isSolved && !newSolvedWords.includes(`across-${word.clue}`)) {
        newSolvedWords.push(`across-${word.clue}`);
      }

      if (!isSolved) allWordsSolved = false;
    });

    // Check down words
    Object.values(crosswordData.down).forEach(word => {
      const isSolved = word.answer.split('').every((char, i) => {
        return grid[word.row + i][word.col].letter === char;
      });

      if (isSolved && !newSolvedWords.includes(`down-${word.clue}`)) {
        newSolvedWords.push(`down-${word.clue}`);
      }

      if (!isSolved) allWordsSolved = false;
    });

    setSolvedWords(newSolvedWords);

    if (allWordsSolved) {
      setGameWon(true);
      setShowWinModal(true);
    }
  };

  const giveHint = () => {
    if (!selectedClue) return;
    
    const word = selectedClue;
    const isAcross = direction === 'across';
    const newGrid = [...grid];

    // Reveal one random missing letter
    const missingIndices = [];
    for (let i = 0; i < word.answer.length; i++) {
      const row = isAcross ? word.row : word.row + i;
      const col = isAcross ? word.col + i : word.col;
      if (newGrid[row][col].letter !== word.answer[i]) {
        missingIndices.push(i);
      }
    }

    if (missingIndices.length > 0) {
      const randomIndex = missingIndices[Math.floor(Math.random() * missingIndices.length)];
      const row = isAcross ? word.row : word.row + randomIndex;
      const col = isAcross ? word.col + randomIndex : word.col;
      
      newGrid[row][col] = {
        ...newGrid[row][col],
        letter: word.answer[randomIndex]
      };

      setGrid(newGrid);
      setShowHint(true);
      setTimeout(() => setShowHint(false), 2000);
      checkWordCompletion();
    }
  };

  const resetGame = () => {
    initializeGrid();
  };

  const isCellInSolvedWord = (row, col) => {
    const cell = grid[row][col];
    
    if (cell.across && solvedWords.includes(`across-${cell.across.clue}`)) {
      return true;
    }
    
    if (cell.down && solvedWords.includes(`down-${cell.down.clue}`)) {
      return true;
    }
    
    return false;
  };

  const isCellInSelectedWord = (row, col) => {
    if (!selectedClue) return false;
    
    const cell = grid[row][col];
    if (direction === 'across') {
      return cell.across === selectedClue;
    } else {
      return cell.down === selectedClue;
    }
  };

  const Footer = () => {
    return (
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '20px',
        marginTop: '40px',
        borderRadius: '12px',
        textAlign: 'center',
        backdropFilter: 'blur(5px)',
      }}>
        <p style={{ marginBottom: '10px' }}>
          © {new Date().getFullYear()} HIZO Games - All rights reserved
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Terms of Service</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Contact Us</a>
        </div>
        <p style={{ marginTop: '10px', opacity: 0.8, fontSize: '0.8rem' }}>
          Made with ❤️ for game lovers
        </p>
      </div>
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
      tabIndex="0"
      onKeyDown={handleKeyDown}
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
            <h2 style={{ 
              fontSize: '2rem', 
              marginTop: 0, 
              color: '#388e3c'
            }}>
              🎉 Congratulations! 🎉
            </h2>
            <p style={{ fontSize: '1.2rem' }}>
              You solved the crossword puzzle!
            </p>
            <div style={{ margin: '2rem 0' }}>
              <div style={{
                fontSize: '1.5rem',
                display: 'inline-block',
                padding: '1rem 2rem',
                backgroundColor: '#388e3c',
                color: '#fff',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}>
                PUZZLE COMPLETE!
              </div>
            </div>
            <button
              onClick={() => {
                setShowWinModal(false);
                resetGame();
              }}
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
        <a 
          href="/" 
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
        </a>
        
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 600,
          color: 'white',
          textTransform: 'uppercase',
          fontFamily: "'Montserrat', sans-serif",
          margin: 0
        }}>
          CROSSWORD PUZZLE
        </h2>
      </div>

      {/* Content */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "2rem",
          gap: "2rem",
          flexWrap: "wrap"
        }}
      >
        {/* Crossword Grid */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            padding: "2rem",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            textAlign: "center"
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${grid[0]?.length || 8}, 50px)`,
              gridTemplateRows: `repeat(${grid.length || 8}, 50px)`,
              gap: "2px",
              margin: "0 auto"
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: cell.isBlack ? "#333" : 
                      isCellInSolvedWord(rowIndex, colIndex) ? "#a5d6a7" :
                      selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? "#90caf9" :
                      isCellInSelectedWord(rowIndex, colIndex) ? "#bbdefb" :
                      "#ffffff",
                    border: "1px solid #ccc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    cursor: cell.isBlack ? "default" : "pointer",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    transition: "background-color 0.2s ease"
                  }}
                >
                  {cell.number && (
                    <span style={{
                      position: "absolute",
                      top: "2px",
                      left: "2px",
                      fontSize: "0.7rem",
                      fontWeight: "bold"
                    }}>
                      {cell.number}
                    </span>
                  )}
                  {cell.letter}
                </div>
              ))
            )}
          </div>

          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
            <button
              onClick={giveHint}
              style={{
                padding: "0.75rem 2rem",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#ff9800",
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#f57c00";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#ff9800";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Get Hint
            </button>

            <button
              onClick={resetGame}
              style={{
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
              New Game
            </button>
          </div>

          {showHint && (
            <div style={{
              marginTop: "1rem",
              color: "#ff9800",
              fontWeight: "bold",
              fontSize: "1.1rem"
            }}>
              Hint applied to selected word!
            </div>
          )}

          <div style={{ 
            marginTop: "1rem",
            color: "#666",
            fontStyle: "italic"
          }}>
            Tip: Press Tab to switch direction on intersecting words
          </div>
        </div>

        {/* Clues */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            padding: "2rem",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            width: "300px",
            maxHeight: "600px",
            overflowY: "auto"
          }}
        >
          <h2 style={{ 
            fontSize: "1.5rem", 
            marginBottom: "1rem",
            color: "#1976d2",
            borderBottom: "2px solid #1976d2",
            paddingBottom: "0.5rem"
          }}>
            Across
          </h2>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: "2rem" }}>
            {Object.entries(crosswordData.across)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([num, clue]) => (
                <li 
                  key={`across-${num}`}
                  onClick={() => {
                    setDirection('across');
                    setSelectedClue(clue);
                    setSelectedCell({ row: clue.row, col: clue.col });
                  }}
                  style={{
                    marginBottom: "0.75rem",
                    cursor: "pointer",
                    backgroundColor: selectedClue === clue && direction === 'across' ? "#e3f2fd" : "transparent",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    borderLeft: solvedWords.includes(`across-${clue.clue}`) ? "4px solid #388e3c" : "4px solid transparent",
                    transition: "all 0.2s ease"
                  }}
                >
                  <strong style={{
                    color: solvedWords.includes(`across-${clue.clue}`) ? "#388e3c" : "#1976d2"
                  }}>{num}.</strong> {clue.clue}
                </li>
              ))
            }
          </ul>

          <h2 style={{ 
            fontSize: "1.5rem", 
            marginBottom: "1rem",
            color: "#e91e63",
            borderBottom: "2px solid #e91e63",
            paddingBottom: "0.5rem"
          }}>
            Down
          </h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {Object.entries(crosswordData.down)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([num, clue]) => (
                <li 
                  key={`down-${num}`}
                  onClick={() => {
                    setDirection('down');
                    setSelectedClue(clue);
                    setSelectedCell({ row: clue.row, col: clue.col });
                  }}
                  style={{
                    marginBottom: "0.75rem",
                    cursor: "pointer",
                    backgroundColor: selectedClue === clue && direction === 'down' ? "#fce4ec" : "transparent",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    borderLeft: solvedWords.includes(`down-${clue.clue}`) ? "4px solid #388e3c" : "4px solid transparent",
                    transition: "all 0.2s ease"
                  }}
                >
                  <strong style={{
                    color: solvedWords.includes(`down-${clue.clue}`) ? "#388e3c" : "#e91e63"
                  }}>{num}.</strong> {clue.clue}
                </li>
              ))
            }
          </ul>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Crossword;