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
  const [clientManager, setClientManager] = useState<ClientEventManager<MATCH_MAKING> | null>(null);
  const [gameManager, setGameManager] = useState<ClientEventManager<IN_GAME> | null>(null);
  const [movesData, setMovesData] = useState<Move[]>([]);
  const [boardHistory, setBoardHistory] = useState<ChessBoard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [playerisWhite, setPlayerisWhite] = useState(false);
  const [_game, set_Game] = useState<IGame | null>(null);
  const [chessGame, setChessGame] = useState<ChessGame | null>(new ChessGame());
  const findChessGame = new ChessGame();

  const [matchMakingPayload , setMatchMakingPayload] = useState<eIJoinQueueEvent | null>(null);

  useEffect(() => {
    
    if (clientManager) return;
    setBoardHistory(() => [findChessGame.getBoard().copyBoard()]);

    const mode = searchParams.get('RankedMode')?.toLowerCase();
    const timer = searchParams.get('TimerMode');
    const ps = searchParams.get('Pseudo');
    const elo = searchParams.get('Elo');
    const newClientManager = new ClientEventManager<MATCH_MAKING>(import.meta.env.VITE_SERVER_URL || 'http://localhost:10001', NAMESPACE_TYPES.MATCH_MAKING, '');
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
    setMatchMakingPayload(payload);
    const listeningPayload: rIIncomingGameEvent = {
      gameSetter: set_Game,
      triggerSetter: setFindPlayer,
      colorSetter: setPlayerisWhite,
      currentClientManager: newClientManager,
      disconnect: setClientManager,
      nextGameManager: setGameManager,
      name: ps,
      url: import.meta.env.VITE_SERVER_URL || 'http://localhost:10001'
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

  const PlayerFind = (_playerisWhite: boolean) => {
    setFindPlayer(true);
    setPlayerisWhite(_playerisWhite);
  };

  const cancelMatchmaking = () => {
    console.log('cancelMatchmaking');
    navigate('/');
  };


  const PreviousMove = () => {
    console.log('Previous move');
    console.log(boardHistory, currentIndex);
    if (boardHistory.length > 0 && currentIndex > 0) {
      const newBoard = boardHistory[currentIndex - 1];
      chessGame?.setBoard(newBoard);
      setCurrentIndex(currentIndex - 1);
    }
  }

  const NextMove = () => {
    console.log('Next move');
    console.log(boardHistory, currentIndex);
    if (boardHistory.length > 0 && currentIndex < boardHistory.length - 1) {
      const newBoard = boardHistory[currentIndex + 1];
      chessGame?.setBoard(newBoard);
      setCurrentIndex(currentIndex + 1);
    }
  }

  const Abandon = () => {
    console.log('Abandon');
  }

  const ProposeNulle = () => {
    console.log('Propose Nulle');
  }

  return (
    <GameContext.Provider value={{
      clientManager : clientManager,
      gameManager,
      playerIsWhite: playerisWhite,
      _game,
      movesData,
      boardHistory,
      currentIndex,
      chessGame : chessGame!,
      setClientManager,
      setMovesData,
      setGameManager,
      set_Game,
      setCurrentIndex,
      timer: searchParams.get('TimerMode'),
      fpayload: matchMakingPayload,
    }}>
      <FindPlayer onCancel={cancelMatchmaking}
        show={!PlayerIsFind}
      />
      <section className="chessGame">
        <div className="leftContainer">
          <PlayerContainer
            isWhitePlayer={playerisWhite}
            playerName={_game ? !playerisWhite ? _game.white_player.name : _game.black_player.name : 'Player'}
            playerScore={_game ? !playerisWhite ? _game.white_player.elo : _game.black_player.elo : 0}
            playerScorePieceValue={2}
            time="10:00"
            enHaut={true}
          />
          <Chat />
          <PlayerContainer
            isWhitePlayer={playerisWhite}
            playerName={_game ? playerisWhite ? _game.white_player.name : _game.black_player.name : 'Player'}
            playerScore={_game ? playerisWhite ? _game.white_player.elo : _game.black_player.elo : 0}
            playerScorePieceValue={2}
            time="10:00"
            enHaut={false}
          />
        </div>
        <div className="chessBoardContainer">
          <ChessBoardRenderer
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

export default Game;
