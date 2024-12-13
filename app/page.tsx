"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import words from "./words.json";

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

const HangmanDrawing = ({ wrongGuesses }: { wrongGuesses: number }) => {
  const parts = [
    <line key="1" x1="60" y1="20" x2="60" y2="50" stroke="black" />,
    <circle key="2" cx="20" cy="70" r="20" stroke="black" fill="none" />,
    <line key="3" x1="20" y1="90" x2="20" y2="140" stroke="black" />,
    <line key="4" x1="20" y1="110" x2="40" y2="130" stroke="black" />,
    <line key="5" x1="20" y1="110" x2="-40" y2="130" stroke="black" />,
    <line key="6" x1="20" y1="140" x2="40" y2="170" stroke="black" />,
    <line key="7" x1="20" y1="140" x2="-80" y2="170" stroke="black" />,
  ];

  return (
    <svg height="200" width="120" className="mb-4">
      <line x1="10" y1="180" x2="100" y2="180" stroke="black" />
      <line x1="60" y1="20" x2="60" y2="180" stroke="black" />
      <line x1="10" y1="20" x2="60" y2="20" stroke="black" />
      <line x1="10" y1="20" x2="10" y2="50" stroke="black" />
      {parts.slice(0, wrongGuesses)}
    </svg>
  );
};

// Add a new component to display the hint
const Hint = ({ hint }: { hint: string }) => (
  <p className="text-yellow-600 text-center mt-4">Tipp: {hint}</p>
);

export default function Home() {
  const [word, setWord] = useState(getRandomWord());
  const [guesses, setGuesses] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<number>(0);

  useEffect(() => {
    // Set the initial guess to a random letter from the word
    const initialGuess =
      word.word[Math.floor(Math.random() * word.word.length)];
    setGuesses([initialGuess]);
  }, [word]);

  const isGameOver = wrongGuesses >= 7;
  const isGameWon = word.word
    .split("")
    .every((letter) => guesses.includes(letter.toLowerCase()));

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const letter = event.key.toLowerCase();
      if (/^[a-zäöüß]$/.test(letter)) {
        handleGuess(letter);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [guesses, wrongGuesses, isGameOver, isGameWon]);

  const handleGuess = (letter: string) => {
    if (guesses.includes(letter)) return;
    setGuesses((prevGuesses) => [...prevGuesses, letter]);
    if (!word.word.toLowerCase().includes(letter.toLowerCase())) {
      setWrongGuesses((prevWrongGuesses) => prevWrongGuesses + 1);
    }
  };

  const resetGame = () => {
    const newWord = getRandomWord();
    setWord(newWord);
    const initialGuess =
      newWord.word[Math.floor(Math.random() * newWord.word.length)];
    setGuesses([initialGuess]);
    setWrongGuesses(0);
  };

  return (
    <div className="fade-in flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 bg-red-100 relative overflow-hidden">
      <div className="snowflakes" aria-hidden="true">
        {Array.from({ length: 30 }).map((_, index) => (
          <div key={index} className="snowflake">
            ❄
          </div>
        ))}
      </div>
      <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 text-green-800 text-center">
        Hangman - Deutsche Weihnachtsgeschenke Wörter
      </h1>
      <HangmanDrawing wrongGuesses={wrongGuesses} />
      <div className="text-xl sm:text-2xl mb-4">
        {word.word.split("").map((letter, index) => (
          <span key={index} className="border-b-2 mx-1 text-green-800">
            {guesses.includes(letter.toLowerCase()) ? letter : "_"}
          </span>
        ))}
      </div>
      <div className="mb-4">
        {isGameOver ? (
          <p className="text-red-600 text-center">
            Das Spiel ist aus! Das Wort war <strong>{word.word}</strong>.
          </p>
        ) : isGameWon ? (
          <p className="text-green-600 text-center">
            Gratulation! Sie haben das Wort erraten.
          </p>
        ) : (
          <p className="text-black text-center">
            Falsche Vermutungen: {wrongGuesses} / 7
          </p>
        )}
        {/* Display hint after 5 wrong guesses */}
        {wrongGuesses >= 5 && !isGameOver && !isGameWon && (
          <Hint hint={word.hint} />
        )}
      </div>
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {"abcdefghijklmnopqrstuvwxyzäöüß".split("").map((letter) => (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={guesses.includes(letter) || isGameOver || isGameWon}
            className="px-2 py-1 border rounded bg-black text-white hover:bg-gray-800"
          >
            {letter}
          </button>
        ))}
      </div>
      {(isGameOver || isGameWon) && (
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Noch einmal spielen!
        </button>
      )}
      <Link href="/words" className="mt-4 text-blue-500 hover:underline">
        Wortliste anzeigen
      </Link>
      <style jsx>{`
        .fade-in {
          @apply transition-opacity duration-1000 ease-in;
          opacity: 0;
          animation: fadeIn 1s forwards;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        .snowflakes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .snowflake {
          position: absolute;
          top: -10vh;
          color: white;
          font-size: 1.5em;
          user-select: none;
          animation: fall linear infinite;
        }

        @keyframes fall {
          0% {
            transform: translateY(-10vh);
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh);
            opacity: 0;
          }
        }

        .snowflake:nth-child(1) {
          left: 3%;
          animation-duration: 10s;
          animation-delay: 0s;
        }

        .snowflake:nth-child(2) {
          left: 6%;
          animation-duration: 12s;
          animation-delay: 2s;
        }

        .snowflake:nth-child(3) {
          left: 9%;
          animation-duration: 8s;
          animation-delay: 4s;
        }

        .snowflake:nth-child(4) {
          left: 12%;
          animation-duration: 14s;
          animation-delay: 6s;
        }

        .snowflake:nth-child(5) {
          left: 15%;
          animation-duration: 10s;
          animation-delay: 8s;
        }

        .snowflake:nth-child(6) {
          left: 18%;
          animation-duration: 12s;
          animation-delay: 10s;
        }

        .snowflake:nth-child(7) {
          left: 21%;
          animation-duration: 8s;
          animation-delay: 12s;
        }

        .snowflake:nth-child(8) {
          left: 24%;
          animation-duration: 14s;
          animation-delay: 14s;
        }

        .snowflake:nth-child(9) {
          left: 27%;
          animation-duration: 10s;
          animation-delay: 16s;
        }

        .snowflake:nth-child(10) {
          left: 30%;
          animation-duration: 12s;
          animation-delay: 18s;
        }

        .snowflake:nth-child(11) {
          left: 33%;
          animation-duration: 10s;
          animation-delay: 0s;
        }

        .snowflake:nth-child(12) {
          left: 36%;
          animation-duration: 12s;
          animation-delay: 2s;
        }

        .snowflake:nth-child(13) {
          left: 39%;
          animation-duration: 8s;
          animation-delay: 4s;
        }

        .snowflake:nth-child(14) {
          left: 42%;
          animation-duration: 14s;
          animation-delay: 6s;
        }

        .snowflake:nth-child(15) {
          left: 45%;
          animation-duration: 10s;
          animation-delay: 8s;
        }

        .snowflake:nth-child(16) {
          left: 48%;
          animation-duration: 12s;
          animation-delay: 10s;
        }

        .snowflake:nth-child(17) {
          left: 51%;
          animation-duration: 8s;
          animation-delay: 12s;
        }

        .snowflake:nth-child(18) {
          left: 54%;
          animation-duration: 14s;
          animation-delay: 14s;
        }

        .snowflake:nth-child(19) {
          left: 57%;
          animation-duration: 10s;
          animation-delay: 16s;
        }

        .snowflake:nth-child(20) {
          left: 60%;
          animation-duration: 12s;
          animation-delay: 18s;
        }

        .snowflake:nth-child(21) {
          left: 63%;
          animation-duration: 10s;
          animation-delay: 0s;
        }

        .snowflake:nth-child(22) {
          left: 66%;
          animation-duration: 12s;
          animation-delay: 2s;
        }

        .snowflake:nth-child(23) {
          left: 69%;
          animation-duration: 8s;
          animation-delay: 4s;
        }

        .snowflake:nth-child(24) {
          left: 72%;
          animation-duration: 14s;
          animation-delay: 6s;
        }

        .snowflake:nth-child(25) {
          left: 75%;
          animation-duration: 10s;
          animation-delay: 8s;
        }

        .snowflake:nth-child(26) {
          left: 78%;
          animation-duration: 12s;
          animation-delay: 10s;
        }

        .snowflake:nth-child(27) {
          left: 81%;
          animation-duration: 8s;
          animation-delay: 12s;
        }

        .snowflake:nth-child(28) {
          left: 84%;
          animation-duration: 14s;
          animation-delay: 14s;
        }

        .snowflake:nth-child(29) {
          left: 87%;
          animation-duration: 10s;
          animation-delay: 16s;
        }

        .snowflake:nth-child(30) {
          left: 90%;
          animation-duration: 12s;
          animation-delay: 18s;
        }
      `}</style>
    </div>
  );
}
