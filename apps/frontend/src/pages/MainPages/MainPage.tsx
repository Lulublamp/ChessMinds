import React, { useState } from "react";
import Game from "../Game/Game";
import HomePage from "../Home/HomePage";

function MainPage() {
  const [showGame, setShowGame] = useState(false);

  const handleMatchmakingClick = () => {
    setShowGame(true);
  };

  const handleCancelMatchmakingClick = () => {
    setShowGame(false);
  };

  if (showGame) {
    return <Game cancelMatchMackingClick={handleCancelMatchmakingClick}/>;
  } else {
    return <HomePage handleMatchmakingClick={handleMatchmakingClick} />;
  }
}

export default MainPage;
