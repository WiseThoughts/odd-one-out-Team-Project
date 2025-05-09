// src/pages/RoundOver.js
import React from "react";
import { useGame } from "../../context/GameLogic";
import { useNavigate, useParams } from "react-router-dom";
import Background from "../../components/Background/background";
import Title from "../../components/Title/title";
import "./round-over.css";

const RoundOver = () => {
  const { roomCode } = useParams();
  const { roundOverData, socket, setRoundOverData } = useGame();
  const navigate = useNavigate();

  if (!roundOverData) {
    return <div>Loading round results...</div>;
  }

  const { result, traitor, innocentWord, players, scores } = roundOverData;

  const handleAnotherRound = () => {
    setRoundOverData(null);
    // Emit start_game to start a new round, or navigate to waiting room for ready status.
    socket.emit("start_game", roomCode);
    navigate(`/waiting-room/${roomCode}`);
  };

  const handleCloseRoom = () => {
    navigate("/");
  };

  return (
    <div className="round-over-container">
      <Background />
      <Title />
      
      <div className="content-card">
        <h2>Round Over</h2>
        <div className="result-info">
          <p>
            <strong>Traitor:</strong> {traitor && traitor.username ? traitor.username : "Unknown"}
          </p>
          <p>
            <strong>Word:</strong> {innocentWord ? innocentWord : "N/A"}
          </p>
          <p>
            <strong>Result:</strong> {result}
          </p>
        </div>
        <div className="players-list">
          <h3>Players & Scores:</h3>
          <ul>
            {players && players.map((p, idx) => (
              <li key={idx}>
                {p.username}: {scores[p.id] !== undefined ? scores[p.id] : 0} points
              </li>
            ))}
          </ul>
        </div>
        <div className="buttons">
          <button className="another-round-btn" onClick={handleAnotherRound}>
            Another Round
          </button>
          <button className="close-room-btn" onClick={handleCloseRoom}>
            Close Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoundOver;
