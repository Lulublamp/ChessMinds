import * as React from "react";
import {  FC } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Network from "./pages/NetworkInit/Network";


const App: FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/network" element={<Network/>}/>
      </Routes>
    </HashRouter>
  )
};

export default App;
