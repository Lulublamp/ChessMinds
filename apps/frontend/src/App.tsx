import React, { FC, useState } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Game from './pages/Game/Game';
import Navbar from './components/Navigation/NavBar/NavBar';
import HomePage from './pages/Home/HomePage';
import Classement from './pages/Classement/Classement';
import MainMenu from './components/Navigation/MainMenu/MainMenu';
import Matchmaking from './components/Navigation/MainMenu/Matchmaking';
import Profil from './pages/Profil/Profil';
import Apprendre from './pages/Apprendre/Apprendre';
import { GameInfoProvider } from './components/ChessGame/GameInfoProvider';
import { UserContext, User } from './components/UserContext';
import AuthWrapper from './components/Navigation/AuthWrapper';
import axios from 'axios';
import { API_BASE_URL } from './config';


const App: FC = () => {

  const [user, setUser] = useState<User | null>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [showMatchmaking, setShowMatchmaking] = useState(false);

  const handleDownloadClick = () => {
    console.log('Bouton Télécharger cliqué');
  };


  const handleLoginPopupClick = () => {
    if (user === null) {
      const token = localStorage.getItem('accessToken');
      if (token !== null) {
        axios
          .get(`${API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setUser({
              email: response.data.adresseMail,
              pseudo: response.data.pseudo,
            });
          })
          .catch((error) => {
            console.log(error);
            localStorage.removeItem('accessToken');
          });
      } else {
        setShowLoginPopup(true);
      }
    }
    else {
      setUser({
        email: user.email,
        pseudo: user.pseudo,
      });
    }
  };

  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const handleCloseSignupPopup = () => {
    setShowSignupPopup(false);
  };

  const handleSwitchToSignup = () => {
    if (user === null) {
      setShowLoginPopup(false);
      setShowSignupPopup(true);
    }
  };

  const handleSwitchToLogin = () => {
    if (user === null) {
      setShowSignupPopup(false);
      setShowLoginPopup(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
  };

  const handleNewGameClick = () => {
    setShowMatchmaking(true);
  };

  const onBackClickMenu = () => {
    setShowMatchmaking(false);
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <HashRouter>
        <Navbar onPlayClick={handleLoginPopupClick} onLogoutClick={handleLogout} />
        <GameInfoProvider>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  onPlayClick={handleLoginPopupClick}
                  onDownloadClick={handleDownloadClick}
                />
              }
            />
            <Route
              path="/MainMenu"
              element={
                !showMatchmaking ? (
                  <MainMenu onNewGameClick={handleNewGameClick} onLogoutClick={handleLogout} />
                ) : (
                  <Matchmaking onBackClick={onBackClickMenu} />
                )
              }
            />
            <Route path="/Game" element={<Game />} />
            <Route path="/Classement" element={<Classement />} />
            <Route path="/Profil" element={ <Profil />} />
            <Route path='/Apprendre' element={<Apprendre />} />
          </Routes>
        </GameInfoProvider>
        <AuthWrapper
          showLoginPopup={showLoginPopup}
          showSignupPopup={showSignupPopup}
          handleCloseLoginPopup={handleCloseLoginPopup}
          handleCloseSignupPopup={handleCloseSignupPopup}
          handleSwitchToSignup={handleSwitchToSignup}
          handleSwitchToLogin={handleSwitchToLogin}
        />
      </HashRouter>
    </UserContext.Provider>
  );
};

export default App;
