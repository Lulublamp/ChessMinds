import * as React from "react";
import { useState, FC, useEffect, useRef } from "react";
import { ClientEventManager , MM_RANKED , NAMESPACE_TYPES , eIJoinQueueEvent, MM_UNRANKED, Match , MatchState, EVENT_TYPES, PRIVATE_LOBBY, PrivateLobby, lobbyPlayer } from '@TRPI/core/core-network/index';
import { ChessBoard, ChessGame, ChessPiece, Color } from "@TRPI/core/core-algo";
// import './TLobbbies.css'



const TLobby: FC = () => {
  const [clientEmitter , setClientEmitter] = useState<ClientEventManager<PRIVATE_LOBBY> | null>(null);
  const [name , setName] = useState<string>("");
  const [match , setMatch] = useState<Match<lobbyPlayer> | null>(null)
  const [code, setCode] = useState<string>("");
  const [inLobby, setInLobby] = useState<boolean>(false);
  const [lobby, setLobby] = useState<PrivateLobby | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [playerId, setPlayerId] = useState<string>("");

  function handleCreateLobby(){
    if(clientEmitter){
      clientEmitter.createLobbyEvent({
        id: playerId,
        name: name,
        setter: setLobby
      
      });
      if(lobby?.code)
      setCode(lobby?.code);
      setInLobby(() => true);
    }
  }

  function handleJoinLobby(code: string){
    if(clientEmitter){
      clientEmitter.joinLobbyEvent({
        code: code,
        player: {
          id: playerId,
          name: name,
        }
      });
      setInLobby(() => true);
    }
  }

  function handleStart(){
    if(clientEmitter){
      clientEmitter.startGameEvent({
        code: code,
        player: {
          id: playerId,
          name: name,
        }
      });
    }
    
  }

  function handleLeaveLobby(){
    if(clientEmitter && lobby){
      clientEmitter.leaveLobbyEvent({
        code: lobby.code,
        player: {
          id: playerId,
          name: name,
        }
      });
      setInLobby(() => false);
    }
  }

  function handleReady(){
    if(clientEmitter && lobby){
      if(!ready) {
        clientEmitter.playerReadyEvent({
          code: lobby.code,
          player: {
            id: playerId,
            name: name,
          }
        });
        setReady(() => true);
      }
      else {
        clientEmitter.playerUnreadyEvent({
          code: lobby.code,
          player: {
            id: playerId,
            name: name,
          }
        });
        setReady(() => false);
      }
    }
  }

  

  

  

  

  


 

  useEffect(() => {
    if(clientEmitter) return;
    if(playerId === "") setPlayerId(() => `${Math.random().toString(36).substr(2, 9)}`);
    const newClientEmitter = new ClientEventManager<PRIVATE_LOBBY>(NAMESPACE_TYPES.PRIVATE_LOBBY , '');
    newClientEmitter.listenToStartGame({setter: setMatch})
    newClientEmitter.listenToUpdatePlayers({setter: setLobby})
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
    <div>
      <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)}/>
      <div className="LobbyControls">
        <button onClick={handleCreateLobby}>Create Lobby</button>
        <input type="text" placeholder="Lobby Code" onChange={(e) => setCode(e.target.value)}/>
        <button onClick={() => handleJoinLobby(code)}>Join Lobby</button>
        {inLobby && <button onClick={handleLeaveLobby}>Leave Lobby</button>}
        {inLobby && <button onClick={handleStart}>Start Game</button>}
      </div>
      <div className="Lobby">
        {inLobby && lobby && <div className="LobbyInfo">
          <h1>Lobby Info</h1>
          <h2>Lobby Code: {lobby.code}</h2>
          <button onClick={handleReady}>{ready ? 'Unready' : 'Ready'}</button>
          <h2>Players</h2>
          <ul>
            {lobby.players.map((player, i) => <li key={i}>{player.name} --- {lobby.ready[player.id] ? 'ready' : 'not ready' }</li>)}
          </ul>
        </div>}
      </div>
    </div>

  )
};

export default TLobby;
