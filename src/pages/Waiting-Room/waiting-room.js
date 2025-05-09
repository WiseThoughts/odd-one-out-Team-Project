// src/pages/Waiting-Room/waiting-room.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameLogic";
import "./waiting-room.css";
import Background from "../../components/Background/background";
import Title from "../../components/Title/title";

function WaitingRoom() {
  const { roomCode } = useParams();
  const { players, socket } = useGame();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Listen for a "game_start" event from the server
    socket.on("game_start", () => {
      navigate(`/game/${roomCode}`);
    });

    return () => {
      socket.off("game_start");
    };
  }, [socket, roomCode, navigate]);

  // Handler for a player marking themselves as ready
  const handleReady = () => {
    if (!isReady) {
      socket.emit("player_ready", { roomCode });
      setIsReady(true);
    }
  };

  // Master button to force game start regardless of ready status or player count
  const handleForceStart = () => {
    navigate(`/game/${roomCode}`);
  };

  return (
    <div>
      <Title />
      <Background />
      <div className="waiting-room-container">
        <h2>Room: {roomCode}</h2>
        <h3>Waiting for all players to be ready...</h3>
        <ul>
          {players.map((p, idx) => (
            <li key={idx}>{p}</li>
          ))}
        </ul>
        <div className="button-container">
          <button
            className={`ready-btn ${isReady ? "ready-active" : ""}`}
            onClick={handleReady}
          >
            {isReady ? "Ready!" : "I'm Ready"}
          </button>
          <button className="master-btn" onClick={handleForceStart}>
            Force Start
          </button>
        </div>
      </div>
    </div>
  );
}

export default WaitingRoom;
