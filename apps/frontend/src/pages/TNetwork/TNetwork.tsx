

import * as React from "react";
import { useState, FC, useEffect, useRef } from "react";
import { ClientEventEmitter , MM_RANKED , NAMESPACE_TYPES , eIJoinQueueEvent, MM_UNRANKED } from '@TRPI/core-nt/index';




const TNetwork: FC = () => {
  const [count, setCount] = useState(0);
  const [clientEmitter , setClientEmitter] = useState<ClientEventEmitter<MM_RANKED> | null>(null);
  const [name , setName] = useState<string>("");
  const [elo , setElo] = useState<number>(0);

  function handleConnection(){
    console.log('handleConnection');
    const clientEmitter = new ClientEventEmitter<MM_RANKED>(NAMESPACE_TYPES.MM_RANKED);
    setClientEmitter(() => clientEmitter);
  }

  function handleJoinQueue(name: string , elo: number){
    if(clientEmitter){
      const mockData: eIJoinQueueEvent = {
        id: `${count}`,
        name: name,
        elo: elo,
      }

      clientEmitter.joinMatchMakingEvent(mockData)

      clientEmitter.leaveMatchMakingEvent(mockData as never)
      

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
      <p>{`In Queu : ${count}`}</p>
    </div>
  );
  
};

export default TNetwork;
