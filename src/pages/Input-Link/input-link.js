import React from 'react';
import './input-link.css';
import Background from '../../components/Background/background';
import Title from '../../components/Title/title';


const inputLink = () => {
  return (
    <div>
        <Title />
        <Background />
        <div className="container">
            <h3>Input game Link</h3>
            <input type="text" placeholder="Enter game link here..." />
            <br />
            <button className="join-button">Join game</button>
        </div>
    </div>
  )
}

export default inputLink
