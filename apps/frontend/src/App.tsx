// import { FC } from "react";
import * as React from "react"
import { HashRouter, Routes, Route } from "react-router-dom";
import { FC } from "react";
import Navbar from "./components/Navigation/NavBar";
import HomePage from "./pages/Home/HomePage";
import Game from "./pages/Game/Game";

const App: FC = () => {
  const [UserConnecter, setConnexion] = React.useState(false);
  const ConnexionOn = () => {
    setConnexion(true);
  };
  const ConnexionOff = () => {
    setConnexion(false);
  };

  return (
    <HashRouter>
      <Navbar
        // Connecter={UserConnecter}
        // changeConnexionOn={ConnexionOn}
        // changeConnexionOff={ConnexionOff}
      />  {/* Peut être vaut mieux mettre la navbar que dans quelquqe 
                      component et pas global comme ça  */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Game" element={<Game />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
