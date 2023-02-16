import * as React from "react";
import { useState, FC } from "react";
import { useWindowContext } from "./contexts/ContextProviders";
import "./App.css";


const App: FC = () => {
  const [count, setCount] = useState(0);
  const windowContext = useWindowContext();

  return (
    <div className="App">
      <h1>Projet Integrateur</h1>
      <div className="card">
        <p>
          Pour pouvoir modifier : <code>frontend/src/App.tsx</code>
        </p>
        <button onClick={() => setCount((count) => count + 1)}>
          Simple compteur {count}
        </button>
        <>{windowContext && <p>{windowContext.test}</p>}</>
      </div>
    </div>
  );
};

export default App;
