import React, { useEffect, useContext, useRef } from 'react';
import { useState } from 'react';
import './GameStyle.css';
import GameControl from '../../components/ChessGame/GameControl';
import NulleButtons from '../../components/Button/NulleButtons';
import PlayerContainer from '../../components/ChessGame/PlayerContainer';
import Chat from '../../components/ChessGame/Chat';
import MovesList from '../../components/ChessGame/TableCoups';
import AbandonButton from '../../components/Button/AbandonButton';
import BottomMenuMobile from '../../components/ChessGame/BottomMenuMobile';
import ChessBoardRenderer from '../../components/ChessGame/ChessBoard';
import MovesListMobile from '../../components/ChessGame/TableCoupMobile';
import { ChessBoard, ChessGame, Pawn, Color, ChessPiece } from '@TRPI/core/core-algo';
import FindPlayer from '../../components/ChessGame/FindPlayer';
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClientEventManager, eIJoinQueueEvent, IGame, IN_GAME, MATCHMAKING_MODE, MATCHMAKING_MODES_TIMERS, MATCH_MAKING, NAMESPACE_TYPES } from '@TRPI/core/core-network';
import { Move, rIIncomingGameEvent } from '@TRPI/core/core-network/src/interfaces/receiveEvents';
import { GameContext } from '../../contexts/GameContext';
import { useGameInfoContext } from '../../components/ChessGame/GameInfoProvider';
import { UserContext } from '../../components/UserContext';
import ChessGameEndPopup from '../../components/ChessGame/ChessGameEndPopup';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

type GameEndInfo = {
  winner: string;
  playerName1: string;
  playerName2: string;
  gameType: string;
  ranking: number;
  rankingChange: number;
};

const Game = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [clientManager, setClientManager] = useState<ClientEventManager<MATCH_MAKING> | null>(null);
  const clientManagerRef = useRef<ClientEventManager<MATCH_MAKING> | null>(null);
  const [gameManager, setGameManager] = useState<ClientEventManager<IN_GAME> | null>(null);
  const [movesData, setMovesData] = useState<Move[]>([]);
  const [boardHistory, setBoardHistory] = useState<ChessBoard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [playerisWhite, setPlayerisWhite] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [_game, set_Game] = useState<IGame | null>(null);
  const [chessGame, setChessGame] = useState<ChessGame | null>(new ChessGame());
  const { selectedTimeMode, isRanked } = useGameInfoContext();
  const user = useContext(UserContext);
  const [elo, setElo] = useState<number>(0);
  const findChessGame = new ChessGame();
  const [gameEndInfo, setGameEndInfo] = useState<GameEndInfo | null>(null);
  const localStorage = window.localStorage;

  const [matchMakingPayload, setMatchMakingPayload] = useState<eIJoinQueueEvent | null>(null);

  const fetchEloData = async (timeMode: MATCHMAKING_MODES_TIMERS) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/classement/elo`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (timeMode === "blitz") {
        setElo(response.data.elo_blitz);
      } else if (timeMode === "bullet") {
        setElo(response.data.elo_bullet);
      } else if (timeMode === "rapid") {
        setElo(response.data.elo_rapide);
      } else {
        console.log("Erreur lors de la récupération des données ELO");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données ELO:", error);
    }
  };

  useEffect(() => {

    if (clientManager) return;
    console.log('mounted in here');

    const fetchDataAndInitClient = async () => {
      await fetchEloData(selectedTimeMode);
      setBoardHistory(() => [findChessGame.getBoard().copyBoard()]);

      const newClientManager = new ClientEventManager<MATCH_MAKING>(import.meta.env.VITE_SERVER_URL || `${API_BASE_URL}`, NAMESPACE_TYPES.MATCH_MAKING, localStorage.getItem("accessToken")!);
      console.log("Info :", selectedTimeMode, isRanked, elo, user.user?.pseudo);
      if (!user.user?.pseudo || elo === undefined || selectedTimeMode === undefined || isRanked === undefined) {
        navigate('/MainMenu');
        return;
      }

      console.log(user)


      const payload: eIJoinQueueEvent = {
        options: {
          mode: isRanked as MATCHMAKING_MODE,
          timer: selectedTimeMode as MATCHMAKING_MODES_TIMERS
        }
      }
      console.log('payload', payload);
      setMatchMakingPayload(payload);
      const listeningPayload: rIIncomingGameEvent = {
        gameSetter: set_Game,
        triggerSetter: setFindPlayer,
        colorSetter: setPlayerisWhite,
        currentClientManager: newClientManager,
        disconnect: setClientManager,
        nextGameManager: setGameManager,
        name: user.user.pseudo,
        url: import.meta.env.VITE_SERVER_URL || `${API_BASE_URL}`
      }
      newClientManager.listenToIncomingMatch(listeningPayload)
      newClientManager.joinMatchMakingEvent(payload)
      setClientManager(() => newClientManager);
      clientManagerRef.current = newClientManager;
      console.log('mounted in here finished');
    }

    fetchDataAndInitClient();
    return () => {
      console.log('unmounting...');
      gameManager?.close();
      clientManagerRef.current?.close();
    }




  }, []);

  const handleGameEnd = (gameResult: any) => {
    if (_game === null) return;
    setGameEndInfo(
      {
        winner: gameResult.winner,
        playerName1: _game.white_player.name,
        playerName2: _game.black_player.name,
        gameType: selectedTimeMode,
        ranking: elo,
        rankingChange: -15
      }
    );
    setShowEndPopup(true); // Afficher la popup de fin de partie
  };

  const handleNewGame = () => {
    console.log('handleNewGame');
  };

  const handleReturn = () => {
    console.log('handleReturn');
    navigate('/MainMenu');
  };

  const [PlayerIsFind, setFindPlayer] = useState(false);

  const PlayerFind = (_playerisWhite: boolean) => {
    setFindPlayer(true);
    setPlayerisWhite(_playerisWhite);
  };

  const cancelMatchmaking = () => {
    console.log('cancelMatchmaking');
    navigate('/MainMenu');
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
      clientManager: clientManager,
      gameManager,
      playerIsWhite: playerisWhite,
      _game,
      movesData,
      boardHistory,
      currentIndex,
      chessGame: chessGame!,
      setClientManager,
      setMovesData,
      setGameManager,
      set_Game,
      setCurrentIndex,
      timer: searchParams.get('TimerMode'),
      fpayload: matchMakingPayload,
    }}>
      {showEndPopup && gameEndInfo && (
        <ChessGameEndPopup
          winner={gameEndInfo.winner ? 'Les noirs' : 'Les blancs'}
          playerName1={gameEndInfo.playerName1}
          playerName2={gameEndInfo.playerName2}
          gameType={gameEndInfo.gameType}
          ranking={gameEndInfo.ranking}
          rankingChange={gameEndInfo.rankingChange}
          onNewGame={handleNewGame} // Implémentez cette fonction pour gérer la création d'une nouvelle partie
          onReturn={handleReturn} // Implémentez cette fonction pour gérer le retour à l'écran précédent
        />
      )}

      <FindPlayer onCancel={cancelMatchmaking}
        show={!PlayerIsFind}
      />
      <section className="chessGame">
        <MovesListMobile moves={movesData} />
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
        <div className='TopContainer Mobile'>
          <PlayerContainer
            isWhitePlayer={playerisWhite}
            playerName={_game ? !playerisWhite ? _game.white_player.name : _game.black_player.name : 'Player'}
            playerScore={_game ? !playerisWhite ? _game.white_player.elo : _game.black_player.elo : 0}
            playerScorePieceValue={2}
            time="10:00"
            enHaut={true}
          />
        </div>
        <div className="chessBoardContainer">
          <ChessBoardRenderer onGameEnd={handleGameEnd} />
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
        <div className='BotContainer Mobile'>
        <PlayerContainer
            isWhitePlayer={playerisWhite}
            playerName={_game ? playerisWhite ? _game.white_player.name : _game.black_player.name : 'Player'}
            playerScore={_game ? playerisWhite ? _game.white_player.elo : _game.black_player.elo : 0}
            playerScorePieceValue={2}
            time="10:00"
            enHaut={false}
          />
        </div>
        <BottomMenuMobile 
          onAbandon={Abandon}
          onDraw={ProposeNulle}
          onPreviousMove={PreviousMove}
          onNextMove={NextMove}
        />
      </section>
    </GameContext.Provider>
  );

}

export default Game;
