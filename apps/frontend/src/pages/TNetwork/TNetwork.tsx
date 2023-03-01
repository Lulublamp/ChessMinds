

import * as React from "react";
import { useState, FC, useEffect, useRef } from "react";
import { ClientEventManager , MM_RANKED , NAMESPACE_TYPES , eIJoinQueueEvent, MM_UNRANKED } from '@TRPI/core-nt/index';
import { rICreateRoomEvent } from "@TRPI/core-nt/src/interfaces/receiveEvents";



const SimpleGameState: any = (clientManager: ClientEventManager<MM_RANKED> | null) => {

  console.log('haha')
  return (
    <div>
      <h1>SimpleGameState</h1>
    </div>
  )
};


const SimpleMatchMakingState: any = (clientManager: ClientEventManager<MM_RANKED> | null , match: any) => {

  console.log('hahaha')
  const [name , setName] = useState<string>("");
  const [elo , setElo] = useState<number>(0);

  function handleJoinQueue(name: string , elo: number){
    if(clientManager){
      const mockData: eIJoinQueueEvent = {
        id: `${Math.random().toString(36).substr(2, 9)}`,
        name: name,
        elo: elo,
      }

      
      clientManager.joinMatchMakingEvent(mockData)
    }
  }
  return (
    <>
      <input type="text" onChange={(event) => setName(() => event.target.value)}/>
      <input type="text" onChange={(event) => setElo(() => Number(event.target.value))}/>
      <h1>Test network</h1>
      <button onClick={() => handleJoinQueue(name , elo)}>
        Join RankedMatchMaking
      </button>
      <p>{match}</p>
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
    </>
  )
}




const TNetwork: FC = () => {
  const [clientEmitter , setClientEmitter] = useState<ClientEventManager<MM_RANKED> | null>(null);
  const [onMatch , setOnMatch] = useState<boolean>(false);
  const [match , setMatch] = useState<Math | null>(null);

  

  

  useEffect(() => {
    if(clientEmitter) return;
    const newClientEmitter = new ClientEventManager<MM_RANKED>(NAMESPACE_TYPES.MM_RANKED , '');
 

    newClientEmitter.listenToInitGame({
      setter: setOnMatch,
      getter: Boolean
    })
    
    setClientEmitter(() => newClientEmitter);
    
    return () => {
      console.log("close");
      newClientEmitter.close();
      setClientEmitter(() => null);
    }
  },[])




  return (
    <div id="TNetwork">
      {
        onMatch ? <SimpleGameState clientManager={clientEmitter}/> : <SimpleMatchMakingState clientManager={clientEmitter} match={match}/>
      }
    </div>

  );
  
};

export default TNetwork;
