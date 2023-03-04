import * as React from "react";
import { useState, FC, useEffect, useRef } from "react";
import { ClientEventManager , MM_RANKED , NAMESPACE_TYPES , eIJoinQueueEvent, MM_UNRANKED, Match , MatchState, EVENT_TYPES } from '@TRPI/core/core-network/index';
import { ChessBoard, ChessGame, ChessPiece, Color } from "@TRPI/core/core-algo";
import BoardG, { IBoardGProps } from "./BoardG";
import './TNetwork.css'



const TNetwork: FC = () => {
  const [clientEmitter , setClientEmitter] = useState<ClientEventManager<MM_RANKED> | null>(null);
  const [name , setName] = useState<string>("");
  const [elo , setElo] = useState<number>(0);
  const [match , setMatch] = useState<Match | null>(null)
  const [game , setGame] = useState<ChessGame>(new ChessGame())
  const [inQueue , setInQueue] = useState<boolean>(false)

  function handleJoinQueue(name: string , elo: number){
    if(clientEmitter){
      const mockData: eIJoinQueueEvent = {
        id: `${Math.random().toString(36).substr(2, 9)}`,
        name: name,
        elo: elo,
      }

      clientEmitter.joinMatchMakingEvent(mockData)
      setInQueue(() => true)
    }
  }

  function handleLeaveQueue(userId: string | undefined){
    if (!userId) return;
    if(clientEmitter){
      clientEmitter.leaveMatchMakingEvent({
        userId: userId
      })
      setInQueue(() => false)
    }
  }

  useEffect(() => {
    if(clientEmitter) return;
    const newClientEmitter = new ClientEventManager<MM_RANKED>(NAMESPACE_TYPES.MM_RANKED , '');
    newClientEmitter.listenToInitGameOnce({setter: setMatch})
    setClientEmitter(() => newClientEmitter);
    console.log("maybe event" , match);
    
    return () => {
      console.log("close");
      newClientEmitter.close();
      setClientEmitter(() => null);
    }
  },[])
  

  useEffect(() => {

    if (!match) return;
    console.log("maybe event in useEffect" , match);
    console.log("before change match")

    return () => {
      console.log("clean up function")
    }

    }, [match])




  return (
    <div id="TNetwork">
      {
        inQueue == false
        
        ?

        <>
          <input type="text" onChange={(event) => setName(() => event.target.value)}/>
          <input type="text" onChange={(event) => setElo(() => Number(event.target.value))}/>
          <h1>Test network</h1>
          <button onClick={() => handleJoinQueue(name , elo)}>
            Join RankedMatchMaking
          </button>
          <h1 style={{color: "red"}}>Match not found</h1>
        </>
        : 

        match ?

        <>
          <h1 style={{color: "green"}}>Match found</h1>
          <div className="Info">
            <h1>Match id: {match.players[0].id + match.players[1].id}</h1>

            <h1>Player 1: {match.players[0].name}</h1>
            <h1>Player 2: {match.players[1].name}</h1>

            <h1>Player 1 elo: {match.players[0].elo}</h1>
            <h1>Player 2 elo: {match.players[1].elo }</h1>
            <p>Tour : {match.currentTurn.name == name ? 'A moi' : 'A lui'}</p>
          </div>
          <div className="Board">
            {
              game.getBoard().getBoard().map((row , i) => {
                return (
                  <div className="Row">
                    {
                      row.map((piece , j) => {
                        return (
                          <div className="Square">
                            <p>{piece?.position}</p>
                          </div>
                        )
                      })
                    }
                  </div>
              )
            })
          }
          </div>
        </>

        :

        <>
          <h1 style={{color: "red"}}>Match not found</h1>
          <button onClick={() => handleLeaveQueue(name)}>
            Leave RankedMatchMaking
          </button>
        </>
  
      }
    </div>        

  )
};

export default TNetwork;
