import React from 'react';
import './innocent-main.css';
import Background from '../../components/Background/background';
import Title from '../../components/Title/title';

const innocentMain = () => {
  return (
    <div className = "innocent-main">
        <Title />
        <Background />

<div className="word-section">
  <Word word={""} />
 </div>

 <div className="Chat">
  <h3>Chat</h3>
 </div>
 </div>

  )
}

export default innocentMain