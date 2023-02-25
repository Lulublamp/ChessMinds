

import * as React from "react";
import { useState, FC, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Socket , io} from "socket.io-client";
import { CoreNameSpaces } from '@TRPI/core-nt/src/Namespace';
import { CoreEvents } from '@TRPI/core-nt/src/Event';
import { ClientEventEmitter } from '@TRPI/core-nt/src/ClientEventEmitter';




const TNetwork: FC = () => {
  const [count, setCount] = useState(0);
  const [currentSocket, setCurrentSocket] = useState<Socket | null>(null);
  const [clientEmitter , setClientEmitter] = useState<ClientEventEmitter | null>(null);
  const [name , setName] = useState<string>("");
  const [elo , setElo] = useState<number>(0);

  function handleConnection(){
    const socket = io("http://localhost:3001/" + CoreNameSpaces.MM_RANKED);
    setCurrentSocket(() => socket);
    const clientEmitter = new ClientEventEmitter(socket);
    setClientEmitter(() => clientEmitter);
  }

  function handleJoinQueue(name: string , elo: number){
    if(clientEmitter && currentSocket){
      clientEmitter.emitter(CoreEvents.JOIN_QUEUE_R , {
        id: `${count}`,
        name: name,
        elo: elo,
      });

      setCount(() => count + 1);
    }
  }




  return (
    <div id="TNetwork">
      <input type="text" onChange={(event) => setName(() => event.target.value)}/>
      <input type="text" onChange={(event) => setElo(() => Number(event.target.value))}/>
      <h1>Test network</h1>
      <button onClick={handleConnection}>
        Connect
      </button>
      <button onClick={() => handleJoinQueue(name , elo)}>
        Join RankedMatchMaking
      </button>
    </div>
  );
  
};

export default TNetwork;
