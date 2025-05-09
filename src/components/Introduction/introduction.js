
import React from 'react';
import './introduction.css';

const introduction = () => {

  return (
    <div class="intro">
      <h2><u>How To Play</u></h2>
      <br></br>
      <h3>Setting up the game:</h3>
      <p>One person will generate the link for the game room and share it with the rest of the group.<br></br> 
      The rest of the players will input the link, joining the game.</p><br></br>
      <h3>Game Instructions:</h3>
      <p>One player will get 'TRAITOR' on their screen and the rest will get a word shared between them.<br></br>
      All players will need to give vague hints towards what the word is, trying to figure out who the traitor is.<br></br>
      The goal of the traitor is to blend in as a player and figure out the word being hinted.<br></br>
      Once a player has figured out who the traitor is, they can select the player from the player list given.<br></br>
      On the other hand, if the traitor figures out the word, they can select it from the word list give to them.</p>
    </div>
  )
}


export default introduction