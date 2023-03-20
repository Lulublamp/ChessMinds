import { FC } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import TNetwork from "./pages/TNetwork/TNetwork";
import TLobby from "./pages/TLobbies/TLobbies";
import Navbar from "./components/Navigation/NavBar";
import HomePage from "./pages/Home/HomePage";
import Game from "./pages/Game/Game";

const App: FC = () => {
  
  return (
    <HashRouter>
      <Navbar /> {/* Peut être vaut mieux mettre la navbar que dans quelquqe 
                      component et pas global comme ça
                  */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Game" element={<Game />} />
        <Route path="/test" element={<TNetwork />} />
        <Route path="/lobby" element={<TLobby />} />
      </Routes>
    </HashRouter>
  )
};

export default App;
