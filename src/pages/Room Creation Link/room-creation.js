
// src/pages/RoomCreation.js
import React from 'react';
import { useGame } from '../../context/GameLogic';
import { useNavigate } from 'react-router-dom';
import './room-creation.css';
import Background from '../../components/Background/background';
import Title from '../../components/Title/title';

const RoomCreation = () => {
  const { roomCode, players } = useGame();
  const navigate = useNavigate();

  const handleNext = () => {
    navigate(`/waiting-room/${roomCode}`);
  };

  return (
    <div className="room-creation-container">
      <Title />
      <Background />
      <div className="container">
        <p className="label">The game link is</p>
        <div className="game-link">{roomCode || 'Generating...'}</div>
        <p className="label">Please share it with the players</p>
        <p className="label">
          <span className="players-count">{players?.length || 0}</span> Players joined
        </p>
        <button className="start-btn" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default RoomCreation;

