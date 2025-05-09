// src/pages/Homepage.js
import React, { useState } from "react";
import { useGame } from "../context/GameLogic";
import { useNavigate } from "react-router-dom";
import Background from "../components/Background/background";
import Title from "../components/Title/title";
import Introduction from "../components/Introduction/introduction";
import "./Homepage.css";

function HomePage() {
  const [roomInput, setRoomInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const { socket, setRoomCode, setPlayerId, setUsername } = useGame();
  const navigate = useNavigate();

  const generateGameLink = () => {
    const randomRoom = Math.random().toString(36).substr(2, 6).toUpperCase();
    setRoomCode(randomRoom);
    if (usernameInput) setUsername(usernameInput);
    socket.emit(
      "join_game",
      { roomCode: randomRoom, username: usernameInput || "Guest" },
      (playerId) => {
        setPlayerId(playerId);
        navigate(`/room-creation/${randomRoom}`);
      }
    );
  };

  const joinGame = () => {
    if (!roomInput) return;
    setRoomCode(roomInput);
    if (usernameInput) setUsername(usernameInput);
    socket.emit(
      "join_game",
      { roomCode: roomInput, username: usernameInput || "Guest" },
      (playerId) => {
        setPlayerId(playerId);
        navigate(`/input-link/${roomInput}`);
      }
    );
  };

  return (
    <div>
      <Title />
      <Background />

      <div className="flexContainer">
        <div className="introBox">
          <Introduction />
        </div>

        {/* New wrapper for the form controls */}
        <div className="controls">
          <div className="inputRow">
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Enter your username"
            />
            <input
              type="text"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              placeholder="Enter Room Code"
            />
          </div>

          <div className="buttonRow">
            <button className="gameLinkButtons" onClick={generateGameLink}>
              Generate Game Link
            </button>
            <button className="gameLinkButtons" onClick={joinGame}>
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
