import React, { useState } from "react";
import playIcon from "../../images/PlayIcon.png";
import learnIcon from "../../images/LearnIcon.png";
import leaderboardIcon from "../../images/LeaderboardIcon.png";
import MenuButton from "../Button/MenuButton";
import "./MainMenuStyle.css";

function MainMenu() {
  const [showSubMenu, setShowSubMenu] = useState(false);

  const handleClick = () => {
    console.log("click");
    setShowSubMenu(!showSubMenu);
  };

  const handleClose = () => {
    setShowSubMenu(false);
  };

  return (
    <div className="menuContainer">
      {!showSubMenu && (
        <div>
          <MenuButton
            id="jouer"
            imgSrc={playIcon}
            imgAlt="playIcon"
            spanText="Jouer"
            imgHeight="50px"
            click={handleClick}
          />
          <MenuButton
            id="apprendre"
            imgSrc={learnIcon}
            imgAlt="learnIcon"
            spanText="Apprendre"
            imgHeight="40px"
          />
          <MenuButton
            id="classement"
            imgSrc={leaderboardIcon}
            imgAlt="leaderboardIcon"
            spanText="Classement"
            imgHeight="37px"
          />
        </div>
      )}
      {showSubMenu && (
        <div className="subMenu_play">
          <MenuButton
            id="jouer"
            imgSrc={playIcon}
            imgAlt="playIcon"
            spanText="Matchmaking"
            imgHeight="50px"
          />
          <MenuButton
            id="apprendre"
            imgSrc={learnIcon}
            imgAlt="learnIcon"
            spanText="Contre l'IA"
            imgHeight="50px"
          />
          <MenuButton
            id="classement"
            imgSrc={leaderboardIcon}
            imgAlt="leaderboardIcon"
            spanText="Affronter un ami"
            imgHeight="50px"
          />
        </div>
      )}
    </div>
  );
}

export default MainMenu;
