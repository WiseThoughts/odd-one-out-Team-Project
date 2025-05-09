
// Dependencies
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// Create an Express app and enable CORS for frontend access
const app = express();
app.use(cors()); 

// Create an HTTP server using Express (for socket.io)
const server = http.createServer(app);
// Create a socket.io server 
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend's URL in production
  },
});

// Define a word bank (expand as needed)
const wordBank = [
  "Banana", "Carrot", "Dolphin", "Eagle", "Flower",
  "Galaxy", "Hedgehog", "Igloo", "Jupiter", "Train",
  "Laptop", "Mountain", "Neptune", "Orange", "Penguin",
  "Owl", "Rainbow", "Strawberry", "Turtle", "Umbrella",
  "Volcano", "Waterfall", "Xylophone", "Yogurt", "Zebra",
  "Acorn", "Bridge", "Stingray", "Desert", "Echo",
  "Fossil", "Giraffe", "Harbor", "Island", "Jungle",
  "Kiwi", "Lighthouse", "Bottle", "Night", "Ocean",
  "Paper", "Quill", "River", "Sunflower", "Thunder",
  "Universe", "Valley", "Wind", "Earth", "Sword",
  "Star", "Aurora", "Blizzard", "Comet", "Door",
  "Ember", "Ring", "Glacier", "Horizon", "Icicle",
  "Ruby", "Pear", "Lightning", "Meteor", "Phone",
  "Oasis", "Pine", "Quasar", "People", "Car",
  "Oak", "Williow", "Plane", "Whisper", "Chair",
  "Orange", "Anime", "Apricot", "Braclet", "Clover",
  "Daisy", "Elm", "Fiddle", "Garden", "Hazelnut",
  "Ink", "Rice", "Chips", "Lemon", "Mango",
  "Pepper", "Olive", "Peach", "Wink", "Rose",
  "Saffron", "Tulip", "Violet", "Walnut", "Pink"
];

// Helper function: Fisher-Yates Shuffle
function shuffleArray(arr) {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// Generate the traitor's word list:
// 1. Select 11 random words (excluding the innocent word)
// 2. Insert the innocent word into the list
// 3. Shuffle and return the final 12-word array
function generateTraitorWords(innocentWord) {
  const filteredBank = wordBank.filter(word => word !== innocentWord);
  const randomSubset = shuffleArray(filteredBank).slice(0, 11);
  randomSubset.push(innocentWord);
  return shuffleArray(randomSubset);
}

// Store game data per room
let gameRooms = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_game", ({roomCode, username}, callback) => {
    socket.join(roomCode);
    if (!gameRooms[roomCode]) {
      // Initialize the room with players and a ready map
      gameRooms[roomCode] = { players: [], traitor: null, innocentWord: null, ready: {} };
    }
    gameRooms[roomCode].players.push({ id: socket.id, username });
    io.to(roomCode).emit("update_players", gameRooms[roomCode].players.map(p => p.username));
    callback(socket.id);
  });

  // New event: track player's ready status
  socket.on("player_ready", ({ roomCode }) => {
    if (gameRooms[roomCode]) {
      // Initialize ready map if it doesn't exist
      if (!gameRooms[roomCode].ready) {
        gameRooms[roomCode].ready = {};
      }
      gameRooms[roomCode].ready[socket.id] = true;
      console.log(`Player ${socket.id} is ready in room ${roomCode}`);

      // Check if all players in the room are ready (and at least 3 players are present)
      const allReady = gameRooms[roomCode].players.every(player => gameRooms[roomCode].ready[player.id]);
      if (allReady && gameRooms[roomCode].players.length >= 3) {
        // Start the game
        startGame(roomCode);
      }
    }
  });

  // "start_game" can also be triggered manually (e.g., via a master button)
  socket.on("start_game", (roomCode) => {
    startGame(roomCode);
  });

  // Function to handle starting the game for a room
  function startGame(roomCode) {
    let players = gameRooms[roomCode]?.players;
    if (players && players.length >= 2) {
      // Randomly select a traitor
      let traitor = players[Math.floor(Math.random() * players.length)];
      // Randomly pick the innocent word from the word bank
      let innocentWord = wordBank[Math.floor(Math.random() * wordBank.length)];
      gameRooms[roomCode].traitor = traitor;
      gameRooms[roomCode].innocentWord = innocentWord;

      // Generate traitor's word list (11 random words + innocent word)
      const traitorWords = generateTraitorWords(innocentWord);

      // Send role-specific messages
      players.forEach((player) => {
        if (player.id === traitor.id) {
          io.to(player.id).emit("traitor_word_list", traitorWords);
          io.to(player.id).emit("you_are_traitor");
        } else {
          io.to(player.id).emit("receive_word", innocentWord);
        }
      });

      console.log(`Game starting in room ${roomCode}: Traitor ${traitor}, Innocent Word: ${innocentWord}`);
      // Emit the game start event to all players
      io.to(roomCode).emit("game_start");
      gameRooms[roomCode].guesses = {};
    } else {
      console.log("Not enough players to start the game.");
    }
  }

  // Traitor guess logic
  // socket.on("traitor_guess", ({ roomCode, guessedWord }) => {
  //   const currentGame = gameRooms[roomCode];
  //   let correct = guessedWord === currentGame?.innocentWord;
  //   io.to(roomCode).emit("game_over", {
  //     result: correct ? "Traitor Wins!" : "Players Win!",
  //     traitor: currentGame?.traitor,
  //     innocentWord: currentGame?.innocentWord,
  //     players: currentGame?.players
  //   });
  // });

  socket.on("player_guess", ({ roomCode, guessType, guess }) => {
    const room = gameRooms[roomCode];
    if (!room) return;
  
    // Initialize guesses if needed
    if (!room.guesses) {
      room.guesses = {};
    }
  
    // Record the guess for the current player (only once)
    if (!room.guesses[socket.id]) {
      room.guesses[socket.id] = { guessType, guess };
      console.log(`Player ${socket.id} guessed: ${guess}`);
    }
    
    // Check if all players have submitted their guess
    if (Object.keys(room.guesses).length === room.players.length) {
      const traitorObj = room.traitor; // Traitor stored as an object { id, username }
      const innocentWord = room.innocentWord;
      
      // Initialize scores if not already done
      if (!room.scores) {
        room.scores = {};
        room.players.forEach(player => {
          room.scores[player.id] = 0;
        });
      }
      
      // Evaluate traitor's guess
      let traitorCorrect = false;
      if (
        room.guesses[traitorObj.id] &&
        room.guesses[traitorObj.id].guessType === "traitor" &&
        room.guesses[traitorObj.id].guess === innocentWord
      ) {
        traitorCorrect = true;
      }
      
      // Tally innocents' votes:
      let correctInnocentsCount = 0;
      room.players.forEach((player) => {
        // Skip the traitor
        if (player.id !== traitorObj.id && room.guesses[player.id]) {
          // If the innocent's guess equals the traitor's id, count it and award 10 points
          if (room.guesses[player.id].guess === traitorObj.id) {
            correctInnocentsCount++;
            room.scores[player.id] += 10;
          }
        }
      });
      
      const totalInnocents = room.players.length - 1;
      
      // For traitor: if they guessed correctly, award 10 points unless every innocent guessed correctly
      if (traitorCorrect && correctInnocentsCount < totalInnocents) {
        room.scores[traitorObj.id] += 10;
      }
      
      // Determine round result based on the traitor's guess
      const roundResult = (traitorCorrect && correctInnocentsCount < totalInnocents)
        ? "Traitor Wins!"
        : "Players Win!";
      
      // Emit the game_over event with the round details and updated scores
      io.to(roomCode).emit("game_over", {
        result: roundResult,
        traitor: traitorObj,
        innocentWord,
        players: room.players,
        scores: room.scores
      });
      
      // Clear guesses for the next round
      room.guesses = {};
    }
  });
  

  

  // Handle player disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    // Optionally, you can remove the player from gameRooms here
  });
});

// Start the server
server.listen(2999, () => {
  console.log("Server running on port 2999");
});