

import * as React from "react";
import { useState, FC } from "react";
import { Link } from "react-router-dom";
import { useWindowContext } from "../../contexts/ContextProviders";
import "./Home.css";


const Home: FC = () => {
  const [count, setCount] = useState(0);
  const windowContext = useWindowContext();

  return (
    <div id="Home">
      <h1>Projet Integrateur</h1>
      <div className="card">
        <p>
          Pour pouvoir modifier : <code>frontend/src/pages/Home/Home.tsx</code>
        </p>
        <button onClick={() => setCount((count) => count + 1)}>
          Simple compteur {count}
        </button>
        <>{windowContext && <p>{windowContext.test}</p>}</>
        <Link to="/TNetwork">Test Réseau</Link>
      </div>
    </div>
  );
  
};

export default Home;
