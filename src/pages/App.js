import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GameProvider } from "../context/GameLogic"; //mport the game state context
import HomePage from "./Homepage"; //Main menu
import TraitorView from "./Traitor-Main/traitor-main";
import RoomCreation from "../pages/Room Creation Link/room-creation"; //Room code creation
import InputLink from "../pages/Input-Link/input-link"; //Input room code
import WaitingPage from "../pages/Waiting-Room/waiting-room"; //Waiting room
import InnocentView from "../pages/Innocent-Main/innocent-main"; //Innocent main
import RoundOver from "../pages/Round-Over/round-over"; //Round over
import GameRoom from "./GameRoom"; //Game logic
import "./App.css";

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          {/* Home Page (Main Menu) */}
          <Route path="/" element={<HomePage />} />
          {/* Room Code Creation Page */}
          <Route path="/room-creation/:roomCode" element={<RoomCreation />} />
          {/* Input Room Code Page */}
          <Route path="/input-link/:roomCode" element={<InputLink />} />
          {/* Waiting Room Page */}
          <Route path="/waiting-room/:roomCode" element={<WaitingPage />} />
          {/* Game Room Page */}
          <Route path="/game/:roomCode" element={<GameRoom />} />
          {/* Round Over Page */}
          <Route path="/round-over/:roomCode" element={<RoundOver />} />

        </Routes>
      </Router>
    </GameProvider>
  );

}

export default App;