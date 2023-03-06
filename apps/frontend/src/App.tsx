import * as React from "react";
import {  FC } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import HomePage from "./pages/Home/HomePage";
import SignUpPage from "./pages/SignUp/SignUp";
import TNetwork from "./pages/TNetwork/TNetwork";
import TLobby from "./pages/TLobbies/TLobbies";


const App: FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/SignUp" element={<SignUpPage/>}/>
        <Route path="/test" element={<TNetwork/>}/>
        <Route path="/lobby" element={<TLobby/>}/>
      </Routes>
    </HashRouter>
  )
};

export default App;
