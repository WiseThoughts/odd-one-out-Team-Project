import React from 'react';
import './room-creation.css';
import Background from '../../components/Background/background';
import Title from '../../components/Title/title';


const roomCreation = () => {
  return (
    <div>className="room-creation-container" 
    <Title />
    <Background />
    
    <div className="container">
      <p>The game link is</p>
      <div className="game-link">-------------------------------</div>
      <p>Please share it with the players</p>
      <p><span class="players-count">0</span> Players joined</p>
      <button className="start-btn">Start game</button>
    </div>
      
    </div>

  
  );
}

export default roomCreation 
