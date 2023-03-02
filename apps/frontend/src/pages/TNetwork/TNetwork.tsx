import * as React from "react";
import { useState, FC, useEffect, useRef } from "react";
import { ClientEventManager , MM_RANKED , NAMESPACE_TYPES , eIJoinQueueEvent, MM_UNRANKED, Match , MatchState, EVENT_TYPES } from '@TRPI/core/core-network/index';
import './TNetwork.css'
import { ChessBoard, ChessGame, ChessPiece } from "@TRPI/core/core-algo";
import BoardG, { IBoardGProps } from "./BoardG";



const TNetwork: FC = () => {
  const [clientEmitter , setClientEmitter] = useState<ClientEventManager<MM_RANKED> | null>(null);
  const [name , setName] = useState<string>("");
  const [elo , setElo] = useState<number>(0);
  const [serializedMattch , ssetMatch] = useState<string>('');
  const [board , setBoard] = useState<Match>({
    chessGame: new ChessGame(),
    players: [],
    state: MatchState.waiting,
    winner: null,
    createdAt: new Date(),
    endedAt: null
  });

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
    const listeningPayload = {
      setter: ssetMatch,
    }
    newClientEmitter.listenToInitGameOnce({
      setter: ssetMatch,
    })
    console.log("maybe event" , serializedMattch);
    setClientEmitter(() => newClientEmitter);
    
    return () => {
      console.log("close");
      newClientEmitter.close();
      setClientEmitter(() => null);
    }
  },[])
  

  useEffect(() => {

    console.log("maybe event in useEffect" , serializedMattch);
    if (!serializedMattch) return;
    console.log("before change match")
    const parsedMatch = JSON.parse(serializedMattch);
    console.log(parsedMatch)

    setBoard((board) => {
      Object.assign(board , parsedMatch);
      return board;
    });
    
    if (!board) {
      console.log("board is null")
      return;
    } 

    console.log("after change match")
    console.log(board)
    


    

    // console.log("after change match use effect")
    // console.log(board)
    // console.log("after change match")
    // board.chessGame.makeMove('b2' , 'b4');
    // console.log(board.chessGame.getBoard().getBoard())
    
    return () => {
      console.log("clean up function")
    }

    // setTimeout(() => 
    //   setBoard(() => {
    //     if(!match) return;
    //     const current = match?.chessGame;
    //     if (!current) return;
    //     return current.getBoard().getBoard();
  // }) , 15000)}, [match])
    }, [serializedMattch])




  return (
    <div id="TNetwork">
      {
        serializedMattch == ''?

        <>
        <input type="text" onChange={(event) => setName(() => event.target.value)}/>
        <input type="text" onChange={(event) => setElo(() => Number(event.target.value))}/>
        <h1>Test network</h1>
        <button onClick={() => handleJoinQueue(name , elo)}>
          Join RankedMatchMaking
        </button>
        {
          !serializedMattch
          
          ?

          <h1 style={
            {
              color: "red"
            }
          }>Match not found</h1>

          :

          <h1 style={{
            color: "green"
          }}>Match found</h1>
        }
        </>

        :


        board.players.length != 0 &&

        <>
          <h1 style={{
            color: "green"
          }}>Match found</h1>

          <div>
            <h1>Match id: {board.players[0].id + board.players[1].id}</h1>

            <h1>Player 1: {board.players[0].name}</h1>
            <h1>Player 2: {board.players[1].name}</h1>

            <h1>Player 1 elo: {board.players[0].elo}</h1>
            <h1>Player 2 elo: {board.players[1].elo }</h1>
            match.chessGame
            &&
            <div id="BoardG">
              {
                board.chessGame.getBoard().getBoard().map((row , i) => {
                  return (
                    <div className="row">
                      {
                        row.map((piece , j) => {
                          return (
                            <div className="square">
                              {
                                piece
                                &&
                                <div className="piece">
                                  {piece.toString()}
                                </div>
                              }
                            </div>
                          )
                        })
                      }
                    </div>
                  )
                })
              }
            </div>
          </div>
        </>
      }

    </div>
  );
  
};

export default TNetwork;
