import React from 'react';
import './App.css';
import Background from '../components/Background/background';
import Title from '../components/Title/title';
import Introduction from '../components/Introduction/introduction';


function App() {
  return (
    <div>
      <Title />
      <Background />
      <div class="flexContainer">
      <div class="introBox"><Introduction /></div>
      <div><button class="gameLinkButtons">Generate game link</button>
      <button class="gameLinkButtons">Input game link</button></div>
      </div>
    </div>
  );
}

export default App;
