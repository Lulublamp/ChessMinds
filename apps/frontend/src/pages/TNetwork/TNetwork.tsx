

import * as React from "react";
import { useState, FC, useEffect } from "react";
import { Link } from "react-router-dom";
import { Socket , io} from "socket.io-client";
import { CoreNameSpaces } from '@TRPI/core-nt/src/Namespace';



const socket = io("http://localhost:3001");
const TNetwork: FC = () => {
  const [count, setCount] = useState(0);
  const [currentSocket, setCurrentSocket] = useState<Socket | null>(null);


  useEffect(() => {
    setCurrentSocket(() => socket);
    console.log("socket", socket.id);



    return () => {
      console.log('On unmount');
    };
  }, []);

  return (
    <div id="TNetwork">
      <h1>Test network</h1>
      <button>
        Join RankedMatchMaking
      </button>
    </div>
  );
  
};

export default TNetwork;
