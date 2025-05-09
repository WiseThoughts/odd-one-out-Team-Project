// src/pages/GameRoom.js
import React, { useEffect } from "react";
import { useGame } from "../context/GameLogic";
import { useNavigate, useParams } from "react-router-dom";
import InnocentMain from "../pages/Innocent-Main/innocent-main";
import TraitorView from "../pages/Traitor-Main/traitor-main";
import "./GameRoom.css";

const GameRoom = () => {
  const { isTraitor, roundOverData } = useGame();
  const { roomCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (roundOverData) {
      navigate(`/round-over/${roomCode}`);
    }
  }, [roundOverData, navigate, roomCode]);

  return (
    <div className="game-room">
      {isTraitor ? <TraitorView /> : <InnocentMain />}
    </div>
  );
};

export default GameRoom;
