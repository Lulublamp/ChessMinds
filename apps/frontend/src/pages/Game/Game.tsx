import React, { useEffect } from 'react';
import { useState } from 'react';
import './GameStyle.css';
import GameControl from '../../components/ChessGame/GameControl';
import NulleButtons from '../../components/Button/NulleButtons';
import PlayerContainer from '../../components/ChessGame/PlayerContainer';
import Chat from '../../components/ChessGame/Chat';
import MovesList from '../../components/ChessGame/TableCoups';
import AbandonButton from '../../components/Button/AbandonButton';
import ChessBoardRenderer from '../../components/ChessGame/ChessBoard';
import { ChessBoard, ChessGame, Pawn, Color, ChessPiece } from '@TRPI/core/core-algo';
import FindPlayer from '../../components/ChessGame/FindPlayer';
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClientEventManager, eIJoinQueueEvent, IGame, IN_GAME, MATCHMAKING_MODE, MATCHMAKING_MODES_TIMERS, MATCH_MAKING, NAMESPACE_TYPES } from '@TRPI/core/core-network';
import { Move, rIIncomingGameEvent } from '@TRPI/core/core-network/src/interfaces/receiveEvents';
import { GameContext } from '../../contexts/GameContext';

const Game = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [clientManager , setClientManager] = useState<ClientEventManager<MATCH_MAKING> | null>(null);
  const [gameManager, setGameManager] = useState<ClientEventManager<IN_GAME> | null>(null);
  const [movesData , setMovesData] = useState<Move[]>([]);
  const [playerisWhite , setPlayerisWhite] = useState(false);
  const [_game , set_Game] = useState<IGame | null>(null);
  const [chessGame, setChessGame] = useState<ChessGame | null>(null);
  const findChessGame = new ChessGame();
  
  useEffect(() => {
    if (clientManager) return;
    setChessGame(() => new ChessGame());
    const mode = searchParams.get('RankedMode')?.toLowerCase();
    const timer = searchParams.get('TimerMode');
    const ps = searchParams.get('Pseudo');
    const elo = searchParams.get('Elo');
    const newClientManager = new ClientEventManager<MATCH_MAKING>(NAMESPACE_TYPES.MATCH_MAKING , '');
    if (!(mode && timer && ps && elo)) return navigate('/');
    const payload: eIJoinQueueEvent = {
      id: `${Math.random().toString(36).substr(2, 9)}`,
      name: ps,
      elo: parseInt(elo),
      options: {
        mode: mode as MATCHMAKING_MODE,
        timer: timer as MATCHMAKING_MODES_TIMERS
      }
    }
    const listeningPayload: rIIncomingGameEvent = {
      gameSetter: set_Game,
      triggerSetter: setFindPlayer,
      colorSetter: setPlayerisWhite,
      currentClientManager: newClientManager,
      disconnect: setClientManager,
      nextGameManager: setGameManager,
      name: ps
    }
    newClientManager.listenToIncomingMatch(listeningPayload)
    newClientManager.joinMatchMakingEvent(payload)
    setClientManager(() => newClientManager);
    console.log('mounted');

    return () => {
      console.log('unmounting...');
      gameManager?.close();
      newClientManager.close()
    }

  }, []);




  const [PlayerIsFind, setFindPlayer] = useState(false);

  const PlayerFind = (_playerisWhite : boolean) => {
    setFindPlayer(true);
    setPlayerisWhite(_playerisWhite);
  };
  
    //PlayerFind after 2s A ENLEVER
  //setTimeout(PlayerFind, 2000);

  const cancelMatchmaking = () => {
    console.log('cancelMatchmaking');
    navigate('/');
  };


  const PreviousMove = () => {
    console.log('Previous move');
  }

  const NextMove = () => {
    console.log('Next move');
  }

  const Abandon = () => {
    console.log('Abandon');
  }

  const ProposeNulle = () => {
    console.log('Propose Nulle');
  }
  
  if (!PlayerIsFind) {
    //A MODIFER FAUX ECHIQUIER
    return (
      <GameContext.Provider value={{
        clientManager,
        gameManager,
        playerIsWhite: playerisWhite,
        _game,
        movesData,
        setClientManager,
        setMovesData,
        setGameManager,
        set_Game
      }}>
      <div>
      <FindPlayer onCancel={cancelMatchmaking}/>
      <section className="chessGame">
        <div className="leftContainer">
          <PlayerContainer
            isWhitePlayer={true}
            playerName = "Pseudo"
            playerScore={800}
            playerScorePieceValue={2}
            time="10:00"
          />
          <Chat />
          <PlayerContainer
            isWhitePlayer={false}
            playerName="Pseudo"
            playerScore={800}
            playerScorePieceValue={2}
            time="10:00"
          />
        </div>
        <div className="chessBoardContainer">
          <ChessBoardRenderer
            chessGame={findChessGame}
          />
        </div>
        <div className="rightContainer">
          <MovesList moves={movesData} />
          <GameControl
            onLeftClick={PreviousMove}
            onRightClick={NextMove}
          />
          <AbandonButton onClick={Abandon} />
          <NulleButtons onClick={ProposeNulle} />
        </div>
      </section>
      </div>
      </GameContext.Provider>
    )
  }
  else if (_game){
    return (
      <GameContext.Provider value={{
        clientManager,
        gameManager,
        playerIsWhite: playerisWhite,
        _game,
        movesData,
        setClientManager,
        setMovesData,
        setGameManager,
        set_Game
      }}>
      <section className="chessGame">
        <div className="leftContainer">
          <PlayerContainer
            isWhitePlayer={true}
            playerName={!playerisWhite ? _game.white_player.name : _game.black_player.name}
            playerScore={!playerisWhite ? _game.white_player.elo : _game.black_player.elo}
            playerScorePieceValue={2}
            time="10:00"
          />
          <Chat />
          <PlayerContainer
            isWhitePlayer={false}
            playerName={playerisWhite ? _game.white_player.name : _game.black_player.name}
            playerScore={playerisWhite ? _game.white_player.elo : _game.black_player.elo}
            playerScorePieceValue={2}
            time="10:00"
          />
        </div>
        <div className="chessBoardContainer">
          <ChessBoardRenderer
            chessGame={chessGame!}
          />
        </div>
        <div className="rightContainer">
          <MovesList moves={movesData} />
          <GameControl
            onLeftClick={PreviousMove}
            onRightClick={NextMove}
          />
          <AbandonButton onClick={Abandon} />
          <NulleButtons onClick={ProposeNulle} />
        </div>
      </section>
      </GameContext.Provider>
    );
  }
}

export default Game;
