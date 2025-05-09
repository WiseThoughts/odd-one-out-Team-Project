// src/context/GameLogic.js
import { createContext, useState, useContext } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:2999"); // Persistent connection

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [roomCode, setRoomCode] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [word, setWord] = useState(null); // Innocent word
  const [isTraitor, setIsTraitor] = useState(false);
  const [points, setPoints] = useState(20);
  const [username, setUsername] = useState("MP");
  const [traitorWords, setTraitorWords] = useState([]); // Traitor's word list
  const [roundOverData, setRoundOverData] = useState(null); // New state for round over info
  const [traitor, setTraitor] = useState(null);

  // Listen for updates from backend
  socket.on("update_players", (players) => setPlayers(players));
  socket.on("receive_word", (word) => setWord(word));
  socket.on("you_are_traitor", () => setIsTraitor(true));
  socket.on("traitor_word_list", (words) => setTraitorWords(words));
  
  // Listen for round over event and store its data
  socket.on("game_over", (data) => {
    setRoundOverData(data);
    // Optionally, update traitor state too
    if (data.traitor) {
      setTraitor(data.traitor);
    }
  });

  // Utility: Fisher-Yates shuffle
  const shuffleArray = (arr) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  // Function to generate the traitor's word list
  const generateTraitorWords = (innocentWord, wordBank) => {
    const filteredBank = wordBank.filter((w) => w !== innocentWord);
    const randomSubset = shuffleArray(filteredBank).slice(0, 11);
    randomSubset.push(innocentWord);
    const finalList = shuffleArray(randomSubset);
    setTraitorWords(finalList);
  };

  // Function to handle the traitor's guess
  const traitorGuess = (selectedWord) => {
    socket.emit("traitor_guess", { roomCode, guessedWord: selectedWord });
  };

  // Function to submit a vote for a suspected traitor
  const submitVote = (votedPlayer) => {
    socket.emit("submit_vote", { roomCode, votedPlayer });
  };

  
  const playerGuess = (guessType, guess) => {
    // Emits the unified player_guess event with the roomCode from context
    socket.emit("player_guess", { roomCode, guessType, guess });
  };


  return (
    <GameContext.Provider
      value={{
        socket,
        roomCode,
        setRoomCode,
        playerId,
        setPlayerId,
        players,
        word,
        isTraitor,
        points,
        username,
        setUsername,
        traitorWords,
        generateTraitorWords,
        traitorGuess,
        submitVote,
        playerGuess,
        roundOverData,
        setRoundOverData,
        traitor,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
