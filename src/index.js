import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App";
import { GameProvider } from "./context/GameLogic";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GameProvider>
    <App />
  </GameProvider>,
  document.getElementById("root")
);
