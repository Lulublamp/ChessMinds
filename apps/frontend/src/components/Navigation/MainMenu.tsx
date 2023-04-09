import React, { useState } from "react";
import playIcon from "../../images/PlayIcon.png";
import learnIcon from "../../images/LearnIcon.png";
import leaderboardIcon from "../../images/LeaderBoardIcon.png";
import MenuButton from "../Button/MenuButton";
import MatchMaking from '../../components/Navigation/Matchmaking';
import RejoindrePerso from '../../components/Navigation/RejoindrePerso';
import CreerPartiePerso from '../../components/Navigation/CreerPartiePrive';
import IAPopUP from '../../components/Navigation/Contre_IA';


import "./MainMenuStyle.css";

function MainMenu({ handleMatchmakingClick }: { handleMatchmakingClick: (RankedMode : string, TimerMode : string, Pseudo : string, Elo : number) => void }) {

  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showMatchmaking, setShowMatchmaking] = useState(false);
  const [showRejoindrePerso, setShowRejoindrePerso] = useState(false);
  const [showCreerPartie, setShowCreerPartie] = useState(false);
  const [showIA, setShowIA] = useState(false);

  const handleClick = () => {
    setShowSubMenu(!showSubMenu);
  };

  const handleClose = () => {
    setShowSubMenu(false);
  };

  const OpenPopupMatchMaking = () => {
    setShowMatchmaking(true);
  };

  const ClosePopupMatchMaking = () => {
    setShowMatchmaking(false);
  };

  const OpenPopupRejoindrePerso = () => {
    setShowRejoindrePerso(true);
  };

  const ClosePopupRejoindrePerso = () => {
    setShowRejoindrePerso(false);
  }
  const OpenPopupCreerPartie = () => {
    setShowCreerPartie(true);
  };

  const ClosePopupCreerPartie = () => {
    setShowCreerPartie(false);
  }
  const OpenPopupIA = () => {
    setShowIA(true);
  };

  const ClosePopupIA = () => {
    setShowIA(false);
  };


  const handleMatchmaking = (RankedMode : string, TimerMode : string, Pseudo : string, Elo : number) => {
    //ICI A MODIFER POUR ENVOYER LES DONNEES AU SERVEUR
    console.log("RankedMode : " + RankedMode);
    console.log("TimerMode : " + TimerMode);
    console.log("Pseudo : " + Pseudo);
    console.log("Elo : " + Elo);
    handleMatchmakingClick(RankedMode, TimerMode, Pseudo, Elo);
    handleClose();
  };

  if (showMatchmaking) {
    return <MatchMaking onCancel={ClosePopupMatchMaking} onPlay={handleMatchmaking} />
  }
  if (showRejoindrePerso) {
    return <RejoindrePerso onCancel={ClosePopupRejoindrePerso} onPlay={handleMatchmaking} />
  }
  if (showCreerPartie) {
    return <CreerPartiePerso onCancel={ClosePopupCreerPartie} onPlay={handleMatchmaking} />
  }
  if (showIA) {
    return <IAPopUP id="1" onCancel={ClosePopupIA}/>
  }
  else {
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
              id="Matchmaking"
              imgSrc={playIcon}
              imgAlt="playIcon"
              spanText="Matchmaking"
              imgHeight="50px"
              click={OpenPopupMatchMaking}
            />
            <MenuButton
              id="ContreIA"
              imgSrc={learnIcon}
              imgAlt="learnIcon"
              spanText="Contre l'IA"
              imgHeight="50px"
              click={OpenPopupIA}
            />
            <MenuButton
              id="Ami"
              imgSrc={leaderboardIcon}
              imgAlt="leaderboardIcon"
              spanText="Affronter un ami"
              imgHeight="50px"
              click={OpenPopupCreerPartie}  // a modifier quand on aura le submenu pour affornter un ami 
            />
          </div>
        )}
      </div>

    );

  }
}

export default MainMenu;
