import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameGallery from './GameGallery';

// Game imports
import TicTacToe from './games/TicTacToe';
import Hangman from './games/Hangman';
import Sudoku from './games/Sudoku';
import Chess from './games/Chess';
import WordSearch from './games/WordSearch';
import Connect4 from './games/Connect4';
import Mines from './games/Mines';
import Snake from './games/Snake';
import Crossword from './games/Crossword';
import Game2048 from './games/Game2048';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameGallery />} />
        <Route path="/games/tictactoe" element={<TicTacToe />} />
        <Route path="/games/Hangman" element={<Hangman />} />
        <Route path="/games/sudoku" element={<Sudoku />} />
        <Route path="/games/chess" element={<Chess />} />
        <Route path="/games/WordSearch" element={<WordSearch />} />
        <Route path="/games/connect4" element={<Connect4 />} />
        <Route path="/games/mines" element={<Mines />} />
        <Route path="/games/snake" element={<Snake />} />
        <Route path="/games/crossword" element={<Crossword />} />
        <Route path="/games/game2048" element={<Game2048 />} />
      </Routes>
    </Router>
  );
}

export default App;
