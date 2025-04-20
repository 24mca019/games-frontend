import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Link } from '@mui/material';
import './GameGallery.css';

const games = [
  { name: "TicTacToe", image: "https://upload.wikimedia.org/wikipedia/commons/3/32/Tic_tac_toe.svg" },
  { name: "Hangman", image: "https://mir-s3-cdn-cf.behance.net/projects/404/db9e21195320515.Y3JvcCw1NzUzLDQ1MDAsMTEyNSww.jpg" },
  { name: "Sudoku", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRaPBLyoY2L4JXvjitb5UenCVPr0RTDH0FNg&s" },
  { name: "WordSearch", image: "https://play-lh.googleusercontent.com/MXsD_HBdXiR6-GEqym_6Dak4zskIKPJYYDFX4ZYWcGC25Seyf1_pA3kaESBfxLX1UCva" },
  { name: "Connect4", image: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/8e/4b/9d/8e4b9db4-2e6b-51e3-5128-2ed877396087/AppIcon-0-0-1x_U007emarketing-0-11-0-0-85-220.jpeg/512x512bb.jpg" },
  { name: "Mines", image: "https://5.imimg.com/data5/SELLER/Default/2023/7/328415288/FM/DL/TJ/42870356/10-500x500.jpg" },
  { name: "Crossword", image: "https://i.pinimg.com/736x/91/90/89/919089d72c1914a4bc65c1bdba8d5253.jpg" },
];

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

export default function GameGallery() {
  const navigate = useNavigate();

  const handleClick = (gameName) => {
    const gamePath = gameName.toLowerCase().replace(/\s+/g, '');
    navigate(`/games/${gamePath}`);
  };

  const topRowGames = games.slice(0, 5);
  const bottomRowGames = games.slice(5);

  return (
    <div
      className="game-gallery-container"
      style={{
        backgroundImage: 'url("https://static.vecteezy.com/system/resources/previews/008/311/935/non_2x/the-illustration-graphic-consists-of-abstract-background-with-a-blue-gradient-dynamic-shapes-composition-eps10-perfect-for-presentation-background-website-landing-page-wallpaper-vector.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div>
        <div className="header-banner">
          <h1 className="logo">HIZO</h1>
          <div className="divider"></div>
          <h2 className="subtitle">PICK YOUR POISON</h2>
          <p className="tagline">CHOOSE WISELY!</p>
        </div>

        {/* Top Row of Games */}
        <Grid container spacing={4} justifyContent="center" className="game-grid">
          {topRowGames.map((game, index) => (
            <Grid item key={index}>
              <Card className="game-card" onClick={() => handleClick(game.name)} style={{ cursor: 'pointer' }}>
                <CardContent className="card-content">
                  <div className="image-container">
                    <img
                      src={game.image}
                      alt={game.name}
                      className="game-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/100?text=No+Image";
                      }}
                    />
                  </div>
                  <p className="game-name">{game.name}</p>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Bottom Row of Games */}
        <Grid container spacing={4} justifyContent="center" className="game-grid">
          {bottomRowGames.map((game, index) => (
            <Grid item key={index}>
              <Card className="game-card" onClick={() => handleClick(game.name)} style={{ cursor: 'pointer' }}>
                <CardContent className="card-content">
                  <div className="image-container">
                    <img
                      src={game.image}
                      alt={game.name}
                      className="game-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/100?text=No+Image";
                      }}
                    />
                  </div>
                  <p className="game-name">{game.name}</p>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}