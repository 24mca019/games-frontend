import React, { Component } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Box, Link } from '@mui/material';
import { randomWord } from './words';

import img0 from "../images/0.png";
import img1 from "../images/1.png";
import img2 from "../images/2.png";
import img3 from "../images/3.png";
import img4 from "../images/4.png";
import img5 from "../images/5.png";
import img6 from "../images/6.png";

class Hangman extends Component {
  static defaultProps = {
    maxWrong: 6,
    images: [img0, img1, img2, img3, img4, img5, img6]
  };

  constructor(props) {
    super(props);
    this.state = {
      nWrong: 0,
      guessed: new Set(),
      answer: randomWord()
    };

    this.handleGuess = this.handleGuess.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  resetGame() {
    this.setState({
      nWrong: 0,
      guessed: new Set(),
      answer: randomWord()
    });
  }

  guessedWord() {
    const { answer, guessed } = this.state;
    return answer.split("").map(ltr => (guessed.has(ltr) ? ltr : "_"));
  }

  handleGuess(evt) {
    let ltr = evt.target.value;
    this.setState(st => {
      const guessed = new Set(st.guessed);
      guessed.add(ltr);
      return {
        guessed,
        nWrong: st.nWrong + (st.answer.includes(ltr) ? 0 : 1)
      };
    });
  }

  generateButtons() {
    const { handleGuess } = this;
    const { guessed } = this.state;
    return "abcdefghijklmnopqrstuvwxyz".split("").map((ltr, index) => (
      <button
        key={index}
        value={ltr}
        onClick={handleGuess}
        disabled={guessed.has(ltr)}
        style={{
          margin: "0.25rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
          cursor: guessed.has(ltr) ? "not-allowed" : "pointer",
          backgroundColor: guessed.has(ltr) ? "#ddd" : "#ffffff"
        }}
      >
        {ltr}
      </button>
    ));
  }

  render() {
    const { nWrong, answer } = this.state;
    const { images, maxWrong } = this.props;

    const alternateText = `${nWrong} wrong guesses`;

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
            HANGMAN
          </h2>
        </div>

        {/* Content */}
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
              maxWidth: "600px",
              width: "100%"
            }}
          >
            <img
              src={images[nWrong]}
              alt={alternateText}
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <p style={{ fontSize: "1.25rem", margin: "1rem 0" }}>
              Number of Wrong attempts: {nWrong}
            </p>

            {answer === this.guessedWord().join("") ? (
              <p style={{ fontSize: "1.5rem", color: "green" }}>Congratulations..! You WON!</p>
            ) : nWrong === maxWrong ? (
              <div>
                <p style={{ fontSize: "1.5rem", color: "red" }}>YOU LOSE</p>
                <p style={{ fontSize: "1.25rem" }}>
                  Correct Word is: <strong>{answer}</strong>
                </p>
              </div>
            ) : (
              <div>
                <p
                  style={{
                    fontSize: "2rem",
                    letterSpacing: "0.5rem",
                    margin: "1rem 0"
                  }}
                >
                  {this.guessedWord()}
                </p>
                <div>{this.generateButtons()}</div>
              </div>
            )}

            <button
              onClick={this.resetGame}
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
  }
}

export default Hangman;