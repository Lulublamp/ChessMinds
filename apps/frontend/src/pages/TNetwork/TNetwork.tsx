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
  const [disponible , setDisponible] = useState<string[]>([])

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

  function renderPiece(piece: ChessPiece | null){
    if(!piece) {
      return (
        <div className="Piece">
          <p>VIDE </p>
        </div>
      )
    };
    return (
      <div className="Piece">
        <p>{piece.position}</p>
      </div>
    )
  }

  function renderRow(row: (ChessPiece | null)[]){
    return row.map((piece) => {
      return (
        <div className="Square">
          <p>{renderPiece(piece)}</p>
        </div>
      )
    })
  }

  function renderBoard(Board: (ChessPiece | null)[][]){
    Board.map((Row) => {
      return (
        <div className="Row">
          {
            Row.map((piece) => {
              return (
                <div className="Square">
                  <div>
                    {
                      piece ? 
                      <p>{piece.position}</p>
                      :
                      <p>VIDE</p>
                    }
                  </div>
                </div>
              )
            })       
          }
        </div>
      )
    })
  }

  function handleClickOnSquare(piece: ChessPiece | null){
    const current: string[] = []
    console.log("click")
    piece?.getLegalMoves(game).map((move) => {
      console.log(move)
      const [x , y] = move.split('')
      //convert x to number from letter from a
      const xNumber =  (move.charCodeAt(0) - 97);
      const yNumber = Number(y) - 1;
      console.log(`handle ${xNumber}${yNumber}`)
      console.log(disponible)
      current.push(`${xNumber}${yNumber}`)
      setDisponible(() => current)
      console.log(disponible)
    })
    if (current.length == 0) {
      setDisponible(() => current)
    };
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

  useEffect(() => {
    console.log("disponible")
  }, [disponible])




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
            <> 
              {
                game.getBoard().getBoard().map((Row , i) => {
                  return (
                    <div key={`Row-${i}`} className="Row">
                      {
                        Row.map((piece , j) => {
                          return (
                            <div key={`Piece - ${j} , ${i}`} className="Square" onClick={() => handleClickOnSquare(piece)}>
                              {
                                piece ? 
                                <p>{`${piece.position}`}</p>
                                :
                                <p>
                                  {
                                    disponible.includes(`${j}${i}`) ?
                                    <p style={{backgroundColor: "red"}}>{`${j}${i}`}</p>
                                    :
                                    <p>{`${j}${i}`}</p>

                                  }
                                </p>
                              }
                            </div>
                          )
                        })       
                      }
                    </div>
                  )
                })
              }
            </>  
          
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
