import * as React from "react";
import {  FC } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import TNetwork from "./pages/TNetwork/TNetwork";


const App: FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/TNetwork" element={<TNetwork/>}/>
      </Routes>
    </HashRouter>
  )
};

export default App;
