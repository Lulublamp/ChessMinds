import React, { FC, useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Game from './pages/Game/Game';
import Navbar from './components/Navigation/NavBar/NavBar';
import HomePage from './pages/Home/HomePage';
import Classement from './pages/Classement/Classement';
import MainMenu from './components/Navigation/MainMenu/MainMenu';
import Matchmaking from './components/Navigation/MainMenu/Matchmaking';
import PrivateGame from './components/Navigation/MainMenu/PrivateGame';
import Profil from './pages/Profil/Profil';
import Replay from './pages/Game/Replay';
import Apprendre from './pages/Apprendre/Apprendre';
import { GameInfoProvider } from './components/ChessGame/GameInfoProvider';
import { UserContext, User } from './components/UserContext';
import AuthWrapper from './components/Navigation/AuthWrapper';
import axios from 'axios';
import { API_BASE_URL } from './config';
import { PublicContext } from './contexts/ContextPublicManager';
import { ClientEventManager, PRIVATE_GAME } from '@TRPI/core/core-network';

const App: FC = () => {

  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [showMatchmaking, setShowMatchmaking] = useState(false);
  const [showPrivateGame, setShowPrivateGame] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const authWrapperRef = useRef<any>(null);
  const [socketGlobal, setSocketGlobal] = useState<ClientEventManager<PRIVATE_GAME> | null>(null);

  const handleDownloadClick = () => {
    console.log('Bouton Télécharger cliqué');
  };

  const togleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.style.setProperty('--background-color', 'var(--background-color-dark)');
      document.documentElement.style.setProperty('--font-color', 'var(--font-color-dark)');
      document.documentElement.style.setProperty('--backgroundCards', 'var(--backgroundCards-dark)');
      document.documentElement.style.setProperty('--secondbackground', 'var(--secondbackground-dark)');
      document.documentElement.style.setProperty('--couleur-caseBlanc', 'var(--couleur-caseBlanc-dark)');
      document.documentElement.style.setProperty('--couleur-caseNoir', 'var(--couleur-caseNoir-dark)');
      document.documentElement.style.setProperty('--drop-shadow', 'var(--drop-shadow-dark)');
    } else {
      document.documentElement.style.setProperty('--background-color', 'var(--background-color-light)');
      document.documentElement.style.setProperty('--font-color', 'var(--font-color-light)');
      document.documentElement.style.setProperty('--backgroundCards', 'var(--backgroundCards-light)');
      document.documentElement.style.setProperty('--secondbackground', 'var(--secondbackground-light)');
      document.documentElement.style.setProperty('--couleur-caseBlanc', 'var(--couleur-caseBlanc-light)');
      document.documentElement.style.setProperty('--couleur-caseNoir', 'var(--couleur-caseNoir-light)');
      document.documentElement.style.setProperty('--drop-shadow', 'var(--drop-shadow-light)');
    }
  }, [darkMode]);

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
            console.log(response.data);
            setUser({
              id: response.data.idJoueur,
              email: response.data.adresseMail,
              pseudo: response.data.pseudo,
            });
            setIsLoggedIn(true);
            authWrapperRef.current.handleSuccessfulLogin();
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
      if (!isLoggedIn)
        setIsLoggedIn(true);
      else {
        authWrapperRef.current.handleSuccessfulLogin();
      }
    }
  };

  useEffect(() => {
    if (authWrapperRef.current) {
      setSocketGlobal(authWrapperRef.current.getPublicManager());
    }
  }, [authWrapperRef.current?.getPublicManager()]);

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
    setShowPrivateGame(false);
  };

  const handleNewPrivateGameClick = () => {
    console.log("private game");
    setShowPrivateGame(true);
  };

  const getMenuElement = () => {
    if (showMatchmaking) {
      return <Matchmaking onBackClick={onBackClickMenu} />;
    }
    if (showPrivateGame) {
      return <PrivateGame onBackClick={onBackClickMenu} />;
    }
    return (
      <MainMenu
        onNewGameClick={handleNewGameClick}
        onLogoutClick={handleLogout}
        onPrivateGameClick={handleNewPrivateGameClick}
        isDarkMode={darkMode}
      />
    );
  };

  useEffect(() => {
    if (socketGlobal) {
      socketGlobal.listenToFriendInvitations((invitations) => {
        console.log('Received friend invitations', invitations);
        // Traiter les invitations ici
      });
    }

    // cleanup function
    return () => {
      if (socketGlobal) {
        socketGlobal.stopListeningToFriendInvitations();
      }
    };
  }, [socketGlobal]);
  
  return (
    <PublicContext.Provider value={{ publicManager: socketGlobal}}>
      <UserContext.Provider value={{ user, setUser }}>
        <HashRouter>
          <Navbar onPlayClick={handleLoginPopupClick} onLogoutClick={handleLogout} toggleDarkMode={togleDarkMode} />
          <GameInfoProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    onPlayClick={handleLoginPopupClick}
                    onDownloadClick={handleDownloadClick}
                    darkMode={darkMode}
                  />
                }
              />
              <Route
                path="/MainMenu"
                element={getMenuElement()}
              />
              <Route path="/Game" element={<Game />} />
              <Route path="/Classement" element={<Classement />} />
              <Route path="/Profil" element={<Profil />} />
              <Route path='/Apprendre' element={<Apprendre />} />
              <Route path='/Replay' element={<Replay />} />
            </Routes>
          </GameInfoProvider>
          <AuthWrapper
            ref={authWrapperRef}
            showLoginPopup={showLoginPopup}
            showSignupPopup={showSignupPopup}
            isLogged={isLoggedIn}
            handleCloseLoginPopup={handleCloseLoginPopup}
            handleCloseSignupPopup={handleCloseSignupPopup}
            handleSwitchToSignup={handleSwitchToSignup}
            handleSwitchToLogin={handleSwitchToLogin}
          />
        </HashRouter>
      </UserContext.Provider>
    </PublicContext.Provider>
  );
};

export default App;
