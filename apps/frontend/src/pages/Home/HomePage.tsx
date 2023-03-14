import React from 'react';
import "./HomePageStyle.css";
import Logo from '../../components/Logo_Icon/Logo';
import chessboardpng from '../../images/ChessBoard.png';
import MainMenu from '../../components/Navigation/MainMenu';
import SocialMedia from '../../components/Logo_Icon/SocialMedia';
import DownloadButton from '../../components/Button/DownloadButton';

function HomePage() {
  return (
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
          <MainMenu />
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
  );
}

export default HomePage;
