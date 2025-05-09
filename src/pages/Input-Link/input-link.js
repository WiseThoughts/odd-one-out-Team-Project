// src/pages/InputLink.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameLogic';
import './input-link.css';
import Background from '../../components/Background/background';
import Title from '../../components/Title/title';

const InputLink = () => {
  // Retrieve room code from URL parameters
  const { roomCode } = useParams();
  const { players } = useGame();
  const navigate = useNavigate();

  const handleJoin = () => {
    // Optionally, you can emit a "join_game" event here if needed,
    // but since your HomePage already joined the game,
    // simply navigate to the waiting room.
    navigate(`/waiting-room/${roomCode}`);
  };

  return (
    <div>
      <Title />
      <Background />
      <div className="container">
        <h3>Input Game Link</h3>
        {/* Display the room code for confirmation */}
        <p>Room Code: {roomCode}</p>
        <h4>Current Players:</h4>
        <ul>
          {players && players.map((p, idx) => (
            <li key={idx}>{p}</li>
          ))}
        </ul>
        <button className="join-button" onClick={handleJoin}>
          Join Game
        </button>
      </div>
    </div>
  );
};

export default InputLink;
