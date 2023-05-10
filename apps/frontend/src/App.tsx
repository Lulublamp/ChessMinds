import React, { FC, useState, useEffect, useRef } from "react";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import Game from "./pages/Game/Game";
import Navbar from "./components/Navigation/NavBar/NavBar";
import HomePage from "./pages/Home/HomePage";
import Classement from "./pages/Classement/Classement";
import MainMenu from "./components/Navigation/MainMenu/MainMenu";
import Matchmaking from "./components/Navigation/MainMenu/Matchmaking";
import PrivateGame from "./components/Navigation/MainMenu/PrivateGame";
import Profil from "./pages/Profil/Profil";
import Replay from "./pages/Game/Replay";
import { GameInfoProvider } from "./components/ChessGame/GameInfoProvider";
import { UserContext, User } from "./components/UserContext";
import AuthWrapper from "./components/Navigation/AuthWrapper";
import axios from "axios";
import { API_BASE_URL } from "./config";
import { PublicContext } from "./contexts/ContextPublicManager";
import PageNotFound from "./components/Navigation/404";
import {
  CONNECTION,
  ClientEventManager,
  IMMPlayer,
  Lobby,
  NAMESPACE_TYPES,
  PGinvitations,
  rILobbyCreated,
} from "@TRPI/core/core-network";
import GameAI from "./pages/Game/GameAi";
import AiMenu from "./components/Navigation/MainMenu/AiMenu";
import PopUpInvitationLobby from "./components/Form/PopUpInvitationLobby";
import { set } from "lodash";
import { PrivateGameContext } from "./contexts/PrivateGameContext";
import Apprendre from "./pages/Apprendre/Apprendre";

const App: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [showMatchmaking, setShowMatchmaking] = useState(false);
  const [showPrivateGame, setShowPrivateGame] = useState(false);
  const [showPopupInvitationLobby, setShowPopupInvitationLobby] =
    useState(false);
  const [lstIdInvitations, setLstIdInvitations] = useState<number[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const [PGInvitations, setPGInvitations] = useState<PGinvitations[]>([]);
  const [PgIndex, setPgIndex] = useState<number>(0);
  const authWrapperRef = useRef<any>(null);

  const [socketGlobal, setSocketGlobal] =
    useState<ClientEventManager<CONNECTION> | null>(null);
  const socketGlobalRef = useRef<ClientEventManager<CONNECTION> | null>(null);

  const [isHost, setIsHost] = useState<boolean>(false);

  const [currentLobbyId, setCurrentLobbyId] = useState<string | null>(null);

  const handleDownloadClick = () => {
    console.log("Bouton Télécharger cliqué");
  };

  const togleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.style.setProperty(
        "--background-color",
        "var(--background-color-dark)"
      );
      document.documentElement.style.setProperty(
        "--font-color",
        "var(--font-color-dark)"
      );
      document.documentElement.style.setProperty(
        "--backgroundCards",
        "var(--backgroundCards-dark)"
      );
      document.documentElement.style.setProperty(
        "--secondbackground",
        "var(--secondbackground-dark)"
      );
      document.documentElement.style.setProperty(
        "--couleur-caseBlanc",
        "var(--couleur-caseBlanc-dark)"
      );
      document.documentElement.style.setProperty(
        "--couleur-caseNoir",
        "var(--couleur-caseNoir-dark)"
      );
      document.documentElement.style.setProperty(
        "--drop-shadow",
        "var(--drop-shadow-dark)"
      );
    } else {
      document.documentElement.style.setProperty(
        "--background-color",
        "var(--background-color-light)"
      );
      document.documentElement.style.setProperty(
        "--font-color",
        "var(--font-color-light)"
      );
      document.documentElement.style.setProperty(
        "--backgroundCards",
        "var(--backgroundCards-light)"
      );
      document.documentElement.style.setProperty(
        "--secondbackground",
        "var(--secondbackground-light)"
      );
      document.documentElement.style.setProperty(
        "--couleur-caseBlanc",
        "var(--couleur-caseBlanc-light)"
      );
      document.documentElement.style.setProperty(
        "--couleur-caseNoir",
        "var(--couleur-caseNoir-light)"
      );
      document.documentElement.style.setProperty(
        "--drop-shadow",
        "var(--drop-shadow-light)"
      );
    }
  }, [darkMode]);

  const handleLoginPopupClick = () => {
    if (user === null) {
      const token = localStorage.getItem("accessToken");
      if (token !== null) {
        axios
          .get(`${API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log("User Logged in with token");
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
            localStorage.removeItem("accessToken");
          });
      } else {
        setShowLoginPopup(true);
      }
    } else {
      if (!isLoggedIn) setIsLoggedIn(true);
      else {
        authWrapperRef.current.handleSuccessfulLogin();
      }
    }
  };

  useEffect(() => {
    if (user == null) {
      console.log("User is not connected");
    } else {
      console.log("User is connected");
      if (socketGlobalRef.current !== null) {
        socketGlobalRef.current.close();
      }
      const _clientManager = new ClientEventManager<CONNECTION>(
        import.meta.env.VITE_SERVER_URL || `${API_BASE_URL}`,
        NAMESPACE_TYPES.CONNECTION,
        localStorage.getItem("accessToken")!
      );
      setSocketGlobal(() => _clientManager);
      socketGlobalRef.current = _clientManager;
      socketGlobalRef.current.listenToInvitationsStatus({
        SetteurLstIdInvite: setLstIdInvitations,
        lstIdInvite: lstIdInvitations,
      });
      socketGlobalRef.current.listenToIncomingInvitations({
        SetteurLstIdInvite: setLstIdInvitations,
        lstIdInvite: lstIdInvitations,
      });
      socketGlobalRef.current.getInvitations(null);
      socketGlobalRef.current.listenToPGinvitation({
        setPopup: setShowPopupInvitationLobby,
        setPGInvitations: setPGInvitations,
      });
    }

    return () => {
      if (socketGlobalRef.current !== null) {
        socketGlobalRef.current.close();
      }
    };
  }, [user]);

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

  const goToPrivateGame = () => {
    authWrapperRef.current.handleGoToMainMenu();
    setShowMatchmaking(false);
    setShowAiMenu(false);
    setShowPrivateGame(true);
  };

  const handleSwitchToLogin = () => {
    if (user === null) {
      setShowSignupPopup(false);
      setShowLoginPopup(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
  };

  const handleNewGameClick = () => {
    setShowMatchmaking(true);
  };

  const onBackClickMenu = () => {
    setShowMatchmaking(false);
    setShowPrivateGame(false);
    setShowAiMenu(false);
  };

  const handleNewPrivateGameClick = () => {
    setShowPrivateGame(true);
    setIsHost(true);
  };

  const handleJoinLobby = (lobbyCode: string) => {
    const id = lobbyCode.split("-")[1].replace("-", "");
    socketGlobalRef.current?.processPGInvitation({
      idInviter: Number(id),
      lobbyId: lobbyCode,
      accept: true,
    });
    setShowPrivateGame(true);
    setCurrentLobbyId(lobbyCode);

  };

  const handleAiGameClick = () => {
    setShowAiMenu(true);
  };

  const getMenuElement = () => {
    if (showMatchmaking) {
      return <Matchmaking onBackClick={onBackClickMenu} />;
    }
    if (showPrivateGame) {
      return (
        <PrivateGameContext.Provider value={{}}>
          <PrivateGame
            onBackClick={onBackClickMenu}
            lstIdInvitations={lstIdInvitations}
            InvitationSetteur={setPGInvitations}
            goToPrivateGame={goToPrivateGame}
            isHost={isHost}
            invitationLobbyId={currentLobbyId!}
          />
        </PrivateGameContext.Provider>
      );
    }
    if (showAiMenu) {
      return <AiMenu onBackClick={onBackClickMenu} />;
    }
    return (
      <MainMenu
        onNewGameClick={handleNewGameClick}
        onLogoutClick={handleLogout}
        onPrivateGameClick={handleNewPrivateGameClick}
        isDarkMode={darkMode}
        onAiGameClick={handleAiGameClick}
        onJoinGameClick={handleJoinLobby}
      />
    );
  };
 
  useEffect(() => {
    return () => {
      console.log("unmount");
    };
  },[showMatchmaking]);

  const onAcceptPG = (invitation: PGinvitations) => {
    console.log("accept private game");
    let indexLobby = PGInvitations.findIndex(
      (invit) => invit.lobbyId === invitation.lobbyId
    );
    setPgIndex(indexLobby);
    socketGlobalRef.current?.processPGInvitation({
      idInviter: PGInvitations[indexLobby].idJoueur,
      lobbyId: PGInvitations[indexLobby].lobbyId,
      accept: true,
    });
    setShowPopupInvitationLobby(false);
    setCurrentLobbyId(invitation.lobbyId);
    setPGInvitations((prevState) =>
      prevState.filter((inv) => inv.lobbyId !== invitation.lobbyId)
    );

    setShowPrivateGame(true);
  };

  const onDeclinePG = (invitation: PGinvitations) => {
    console.log("decline private game");
    setPGInvitations((prevState) =>
      prevState.filter((inv) => inv.lobbyId !== invitation.lobbyId)
    );
  };

  return (
    <PublicContext.Provider value={{ publicManager: socketGlobal }}>
      <UserContext.Provider value={{ user, setUser }}>
        <HashRouter>
          <Navbar
            onPlayClick={handleLoginPopupClick}
            onLogoutClick={handleLogout}
            toggleDarkMode={togleDarkMode}
            lstIdInvitations={lstIdInvitations}
          />
          {PGInvitations.map((invitation, index) => (
            <PopUpInvitationLobby
              key={index}
              invitation={invitation}
              onAccept={() => onAcceptPG(invitation)}
              onDecline={() => onDeclinePG(invitation)}
            />
          ))}
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
              <Route path="/MainMenu" element={getMenuElement()} />
              <Route path="/Game" element={<Game />} />
              <Route path="/Classement" element={<Classement />} />
              <Route
                path="/Profil"
                element={<Profil lstIdInvitations={lstIdInvitations} />}
              />
              <Route path="/Replay" element={<Replay />} />
              <Route path="/GameAi" element={<GameAI />} />
              <Route path="/Apprendre" element={<Apprendre />} />
              <Route path="/*" element={<PageNotFound onBackClick={() => {authWrapperRef.current.handleGoToMainMenu()}} />} />
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
