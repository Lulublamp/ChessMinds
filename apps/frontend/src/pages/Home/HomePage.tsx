import React from 'react';
import Navbar from '../components/Navbar';
import MainMenu from '../components/MainMenu';
import InfoSection from '../components/InfoSection';
import BottomSection from '../components/BottomSection';
import "./HomePageStyle.css";


function HomePage() {
  return (
    <div className="HomePage">
      <Navbar />
      <main>
        <h1>Relevez le défi de jouer aux échecs en ligne</h1>
        <MainMenu />
        <InfoSection />
        <BottomSection />
      </main>
    </div>
  );
}

export default HomePage;
