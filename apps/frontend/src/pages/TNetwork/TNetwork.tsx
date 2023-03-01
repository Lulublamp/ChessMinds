import * as React from "react";
import { useState, FC, useEffect, useRef } from "react";
import { ClientEventManager , MM_RANKED , NAMESPACE_TYPES , eIJoinQueueEvent, MM_UNRANKED, Match, EVENT_TYPES } from '@TRPI/core/core-network/index';
import './TNetwork.css'
import { ChessGame, ChessPiece } from "@TRPI/core/core-algo";
import BoardG, { IBoardGProps } from "./BoardG";



const TNetwork: FC = () => {
  const [clientEmitter , setClientEmitter] = useState<ClientEventManager<MM_RANKED> | null>(null);
  const [name , setName] = useState<string>("");
  const [elo , setElo] = useState<number>(0);
  const [match , setMatch] = useState<Match | null>(null);
  const [board , setBoard] = useState<(ChessPiece | null)[][]>();

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
    newClientEmitter.socket.on(EVENT_TYPES.INIT_GAME , (match: Match) => {
      console.log("match -> GO" , match);
      setMatch(() => match);
    })
    console.log("maybe event" , match);
    setClientEmitter(() => newClientEmitter);
    
    return () => {
      console.log("close");
      newClientEmitter.close();
      setClientEmitter(() => null);
    }
  },[])

  useEffect(() => {

    if (!match) return;
    setMatch(() => match);

    // setTimeout(() => 
    //   setBoard(() => {
    //     if(!match) return;
    //     const current = match?.chessGame;
    //     if (!current) return;
    //     return current.getBoard().getBoard();
  // }) , 15000)}, [match])
    }, [match])




  return (
    <div id="TNetwork">
      {
        !match ?

        <>
        <input type="text" onChange={(event) => setName(() => event.target.value)}/>
        <input type="text" onChange={(event) => setElo(() => Number(event.target.value))}/>
        <h1>Test network</h1>
        <button onClick={() => handleJoinQueue(name , elo)}>
          Join RankedMatchMaking
        </button>
        {
          <h1 style={
            {
              color: "red"
            }
          }>Match not found</h1>
        }
        </>

        :

        <>
          <h1 style={{
            color: "green"
          }}>Match found</h1>

          <div>
            <h1>Match id: {match.players[0].id + match.players[1].id}</h1>

            <h1>Player 1: {match.players[0].name}</h1>
            <h1>Player 2: {match.players[1].name}</h1>

            <h1>Player 1 elo: {match.players[0].elo}</h1>
            <h1>Player 2 elo: {match.players[1].elo }</h1>
            <BoardG _={match}>
            </BoardG>
          </div>
        </>
      }

    </div>
  );
  
};

export default TNetwork;
