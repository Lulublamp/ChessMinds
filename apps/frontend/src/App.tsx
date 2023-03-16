import * as React from "react";
import { FC } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import TNetwork from "./pages/TNetwork/TNetwork";
import TLobby from "./pages/TLobbies/TLobbies";
import Navbar from "./components/Navigation/NavBar";
import Game from "./pages/Game/Game";


const App: FC = () => {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/test" element={<TNetwork />} />
        <Route path="/lobby" element={<TLobby />} />
      </Routes>
    </HashRouter>
  )
};

export default App;
