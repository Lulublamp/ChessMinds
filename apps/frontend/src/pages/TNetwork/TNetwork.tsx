

import * as React from "react";
import { useState, FC, useEffect, useRef } from "react";
import { ClientEventManager , MM_RANKED , NAMESPACE_TYPES , eIJoinQueueEvent, MM_UNRANKED } from '@TRPI/core-nt/index';




const TNetwork: FC = () => {
  const [clientEmitter , setClientEmitter] = useState<ClientEventManager<MM_RANKED> | null>(null);
  const [name , setName] = useState<string>("");
  const [elo , setElo] = useState<number>(0);
  const [match , setMatch] = useState<Math | null>(null);

  function handleJoinQueue(name: string , elo: number){
    if(clientEmitter){
      const mockData: eIJoinQueueEvent = {
        id: `${Math.random().toString(36).substr(2, 9)}`,
        name: name,
        elo: elo,
      }

      clientEmitter.joinMatchMakingEvent(mockData)
    }
  }

  useEffect(() => {
    if(clientEmitter) return;
    const newClientEmitter = new ClientEventManager<MM_RANKED>(NAMESPACE_TYPES.MM_RANKED , '');
    newClientEmitter.listenToInitGame(setMatch)
    setClientEmitter(() => newClientEmitter);
    
    return () => {
      console.log("close");
      newClientEmitter.close();
      setClientEmitter(() => null);
    }
  },[])




  return (
    <div id="TNetwork">
      <input type="text" onChange={(event) => setName(() => event.target.value)}/>
      <input type="text" onChange={(event) => setElo(() => Number(event.target.value))}/>
      <h1>Test network</h1>
      <button onClick={() => handleJoinQueue(name , elo)}>
        Join RankedMatchMaking
      </button>
      {
        match ? <h1 style={
          {
            color: "green"
          }
        }>Match found</h1> :
        <h1 style={
          {
            color: "red"
          }
        }>Match not found</h1>
      }

    </div>
  );
  
};

export default TNetwork;
