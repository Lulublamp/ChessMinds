import React from 'react';
import "./HomePageStyle.css";
import Logo from '../../components/Logo_Icon/Logo';
import chessboardpng from '../../images/ChessBoard.png';
import MainMenu from '../../components/Navigation/MainMenu';
import SocialMedia from '../../components/Logo_Icon/SocialMedia';
import DownloadButton from '../../components/Button/DownloadButton';
import Navbar from "../../components/Navigation/NavBar";
import { useNavigate } from 'react-router-dom';

function HomePage() {

  const navigate = useNavigate();
  const handleMatchmakingClick = (RankedMode : string, TimerMode : string, Pseudo : string, Elo : number) => {
    navigate({
      pathname: '/Game',
      search: '?RankedMode=' + RankedMode + '&TimerMode=' + TimerMode + '&Pseudo=' + Pseudo + '&Elo=' + Elo,
    });
    
  }

  return (
    <div>
      <main>
        <section className="homePage">
          <div>
            <h1>
              <span>Chess</span>
              <span>MINDS</span>
            </h1>
            <div className="chessBoardBackground">
              <img src={chessboardpng} alt="ChessMinds" />
            </div>
            <MainMenu
              handleMatchmakingClick={handleMatchmakingClick} 
            />
          </div>
          <div>
            <div>
              <div>
                <SocialMedia />
                <DownloadButton />
              </div>
              <Logo />
            </div>
          </div>
        </section>
      </main>
    </div>

  );
}

export default HomePage;
