//dependancies
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

//makes an express app and adds cors so the front end can access
const app = express();
app.use(cors()); 

//makes a http server using express for socket.io to run on
const server = http.createServer(app);
//creates a socket.io server 
const io = new Server(server, {
  cors: {
    origin: "*", //replace with frontends url
  },
});

let gameRooms = {}; //Store game data (players traiotor and word)

//when a player connects get assinged a socket id
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_game", (roomCode) => { //checks for player joing a room
    socket.join(roomCode); //adds the player id to the room
    if (!gameRooms[roomCode]) { //if the room doesn't exist make one
      gameRooms[roomCode] = { players: [], traitor: null, word: null };
    } 

    //tells the room that a player has joined and makes it available for the other players
    gameRooms[roomCode].players.push(socket.id);
    io.to(roomCode).emit("update_players", gameRooms[roomCode].players);

    console.log(`Player ${socket.id} joined room ${roomCode}`);
  });

  // Start game & assign traitor
  socket.on("start_game", (roomCode) => {
    let players = gameRooms[roomCode]?.players;
    if (players && players.length >= 3) { //makes sure there are more than three players
      let traitor = players[Math.floor(Math.random() * players.length)]; //chooses random person as traitor
    let word = "SECRET_WORD"; //ADD WORD GENERATOR HERE

      gameRooms[roomCode].traitor = traitor; //identifies the traitor
      gameRooms[roomCode].word = word; //adds the word

      //Send word to all except traitor
      players.forEach((player) => {
        io.to(player).emit(
          player === traitor ? "you_are_traitor" : "receive_word",
          word
        );
      });

      console.log(`Traitor: ${traitor}, Word: ${word}`);
    }
  });

  //voting logic
  //innocents logic
  socket.on("submit_vote", ({ roomCode, votedPlayer }) => {
    io.to(roomCode).emit("vote_result", { votedPlayer });
  }); //sends the players vote to all other players so we know who has voted

  //traitors logic
  socket.on("traitor_guess", ({ roomCode, guessedWord }) => {
    let correct = guessedWord === gameRooms[roomCode]?.word;
    io.to(roomCode).emit("game_over", { result: correct ? "Traitor Wins!" : "Players Win!" });
  });

  //incase of player disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

//starts the server on the local host to be replaced with the server url
server.listen(3001, () => {
  console.log("Server running on port 3001");
});
