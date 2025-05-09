
import React, { useEffect, useState } from "react";
import { useGame } from "../../context/GameLogic";
import Background from "../../components/Background/background";
import Title from "../../components/Title/title";
import "./traitor-main.css";

const TraitorView = () => {
  const {
    innocentWord,
    traitorWords,
    generateTraitorWords,
    playerGuess,
    points,
    username,
  } = useGame();

  const [selectedWord, setSelectedWord] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (traitorWords.length === 0 && innocentWord) {
      generateTraitorWords(innocentWord);
    }
    // eslint-disable-next-line
  }, [innocentWord]);

  const handleWordClick = (word) => {
    if (submitted) return;
    setSelectedWord(word);
  };

  const handleSubmit = () => {
    if (!selectedWord) return;
    playerGuess("traitor", selectedWord);
    setSubmitted(true);
  };

  return (
    <div className="traitor-container">
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

        <div className="traitor-screen">
          <div className="traitor-banner">TRAITOR</div>
          <h3 className="pick-word-title">Pick the word</h3>

          {/* Options as rounded rectangles */}
          <div className="word-options">
            {traitorWords.map((w, i) => (
              <div
                key={i}
                className={`word-option ${
                  selectedWord === w ? "selected" : ""
                }`}
                onClick={() => handleWordClick(w)}
              >
                {w}
              </div>
            ))}
          </div>

          {/* Submit button flips to “Submitted” + green */}
          <button
            className={`submit-button ${submitted ? "submitted" : ""}`}
            onClick={handleSubmit}
            disabled={!selectedWord || submitted}
          >
            {submitted ? "Submitted" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TraitorView;

