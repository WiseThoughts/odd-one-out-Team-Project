
// src/pages/Innocent-Main/innocent-main.js
import React, { useState } from "react";
import "./innocent-main.css";
import { useGame } from "../../context/GameLogic";
import Background from "../../components/Background/background";
import Title from "../../components/Title/title";

const InnocentMain = () => {
  const { players, word, points, username, playerGuess } = useGame();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelectPlayer = (player) => {
    if (submitted) return;   // no changes after submission
    setSelectedPlayer(player);
  };

  const handleSubmit = () => {
    if (!selectedPlayer) return;
    playerGuess("vote", selectedPlayer);
    setSubmitted(true);
  };

  return (
    <div className="innocent-container">
      <Background />
      <Title />

      <div className="content-card">
        <div className="header">
          <button className="back-button" onClick={() => window.history.back()}>
            ← Back
          </button>
          <div className="points-area">
            <span>{points} points</span>
            <span>{username}</span>
          </div>
        </div>

        <div className="innocent-screen">
          <div className="word-banner">{word || "WORD"}</div>
          <h3 className="pick-traitor-title">Pick A Traitor</h3>

          <div className="player-options">
            {players.map((player, idx) => (
              <div
                key={idx}
                className={`player-option ${
                  selectedPlayer === player ? "selected" : ""
                }`}
                onClick={() => handleSelectPlayer(player)}
              >
                {player}
              </div>
            ))}
          </div>

          <button
            className={`submit-button ${submitted ? "submitted" : ""}`}
            onClick={handleSubmit}
            disabled={!selectedPlayer || submitted}
          >
            {submitted ? "Submitted" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InnocentMain;

