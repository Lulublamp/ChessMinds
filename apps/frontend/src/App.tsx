import * as React from "react";
import {  FC } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";


const App: FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>
    </HashRouter>
  )
};

export default App;
