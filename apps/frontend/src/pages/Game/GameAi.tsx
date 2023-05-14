import React, { useEffect, useContext, useRef } from 'react';
import { useState } from 'react';
import './GameStyle.css';
import GameControl from '../../components/ChessGame/GameControl';
import NulleButtons from '../../components/Button/NulleButtons';
import { PlayerContainerAffichage } from '../../components/ChessGame/PlayerContainer';
import Chat from '../../components/ChessGame/Chat';
import MovesList from '../../components/ChessGame/TableCoups';
import AbandonButton from '../../components/Button/AbandonButton';
import BottomMenuMobile from '../../components/ChessGame/BottomMenuMobile';
import ChessBoardRenderer from '../../components/ChessGame/ChessBoard';
import MovesListMobile from '../../components/ChessGame/TableCoupMobile';
import { ChessBoard, ChessGame, Pawn, Color, ChessPiece, Rook, Knight, Bishop, Queen } from '@TRPI/core/core-algo';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Move, rIIncomingGameEvent } from '@TRPI/core/core-network/src/interfaces/receiveEvents';
import { UserContext } from '../../components/UserContext';
import ChessGameEndPopup from '../../components/ChessGame/ChessGameEndPopup';
import PopUpPromotion from '../../components/ChessGame/PopUpPromotion ';
import axios from 'axios';
import { MATCHMAKING_MODES_TIMERS } from '@TRPI/core/core-network';
import DisplayPiece from '../../components/ChessGame/DisplayPiece';
import { set } from 'lodash';

type GameEndInfo = {
  winner: string;
  playerName1: string;
  playerName2: string;
  gameType: string;
  ranking: number;
  rankingChange: number;
};

const GameAI = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [movesData, setMovesData] = useState<Move[]>([]);
  const [boardHistory, setBoardHistory] = useState<ChessBoard[]>([new ChessGame().getBoard()]);
  const [currentIndex, setCurrentIndex] = useState<number>(1);
  const [playerisWhite, setPlayerisWhite] = useState(true);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [fromToPromotion, setFromToPromotion] = useState<string[]>([]);
  const [showPromotionPopup, setShowPromotionPopup] = useState(false);
  const [chessGame, setChessGame] = useState<ChessGame | null>(new ChessGame());
  const user = useContext(UserContext);
  const [elo, setElo] = useState<number>(0);
  const [eloAi, setEloAi] = useState<number>(0);
  const [gameEndInfo, setGameEndInfo] = useState<GameEndInfo | null>(null);
  const [selectedCase, setSelectedCase] = useState<{ row: number, col: number } | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [differentialPiecesWhite, setDifferentialPiecesWhite] = useState<Map<string, number> | null>(null);
  const [differentialPiecesBlack, setDifferentialPiecesBlack] = useState<Map<string, number> | null>(null);

  useEffect(() => {
    const eloAiFromUrl = searchParams.get('eloAi');
    if (eloAiFromUrl) {
      setEloAi(parseInt(eloAiFromUrl));
    }
    else {
      setEloAi(3600);
    }
  }, []);

  const handleGameEnd = (gameResult: any) => {
    setGameEndInfo(
      {
        winner: gameResult.winner,
        playerName1: user.user?.pseudo || "Joueur 1",
        playerName2: "AI",
        gameType: MATCHMAKING_MODES_TIMERS.RAPID, //Faudrait un type spécial AI
        ranking: elo,
        rankingChange: 0,
      }
    );
    setShowEndPopup(true);
  };

  const handleShowPromotion = (from: string, to: string) => {
    setShowPromotionPopup(true);
    setFromToPromotion([from, to]);
  };

  const handleClosePromotion = () => {
    setShowPromotionPopup(false);
  };

  const handlePromotion = (from: string, to: string, piece: string) => {
    if (!chessGame) return;
    chessGame.makeMove(from, to, piece);
    setDifferentialPiecesWhite(chessGame.getWhitePlayerPiecesTaken());
  };

  const NewGame = () => {
    console.log('New game');
    setChessGame(new ChessGame());
    setMovesData([]);
    setBoardHistory([new ChessGame().getBoard()]);
    setCurrentIndex(1);
    setPlayerisWhite(true);
    setLegalMoves([]);
    setShowEndPopup(false);
  }

  const BackToMenu = () => {
    navigate("/MainMenu");
  }

  const handleAiTurn = async (playerMove: any | null) => {
    if (!chessGame) return;
    let fen = chessGame.generateFEN();
    try {
      const response = await axios.post(`https://lucas-blampied.fr/ChessAi/test.php`, { 
        fen: fen, elo: eloAi,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      //const response = { data: { bestmove: "d7d5" } };
      if (response.data.bestmove) {
        let from = response.data.bestmove[0] + response.data.bestmove[1];
        let to = response.data.bestmove[2] + response.data.bestmove[3];
        const gameResult = chessGame.makeMove(from, to);
        setDifferentialPiecesBlack(chessGame.getBlackPlayerPiecesTaken());
        if (gameResult) {
          handleGameEnd(gameResult);
        }
        if (playerMove == null) {
          let newMove = {
            turn: 1,
            white: null,
            whitePiece: null,
            black: to,
            blackPiece: chessGame.getBoard().getPieceAt(to),
          };
          setMovesData((current) => [...current, newMove]);
        } else {
          let lastMove = playerMove; //Degueu mais pas le temps de faire mieux
          lastMove.black = to;
          lastMove.blackPiece = chessGame.getBoard().getPieceAt(to);
          setMovesData((current) => [...current.slice(0, -1), lastMove]);
        }
        setCurrentIndex(currentIndex + 1);
        boardHistory.push(chessGame.getBoard().copyBoard());
      } else {
        console.log("No best move received from API.");
      }
    } catch (error) {
      console.error("Error during AI turn:", error);
    }
  }

  const NextMove = () => {
    if (boardHistory.length > 0 && currentIndex < boardHistory.length - 1) {
      const newBoard = boardHistory[currentIndex + 1];
      chessGame?.setBoard(newBoard);
      setCurrentIndex(currentIndex + 1);
    }
  }

  const PreviousMove = () => {
    if (boardHistory.length > 0 && currentIndex > 0) {
      const newBoard = boardHistory[currentIndex - 1];
      chessGame?.setBoard(newBoard);
      setCurrentIndex(currentIndex - 1);
    }
  }

  const Abandon = () => {
    handleGameEnd({
      status: 'abandon',
      winner: chessGame!.getCurrentTurn() === Color.White ? Color.Black : Color.White,
      message: `Checkmate Winner: ${chessGame!.getCurrentTurn()}`,
    });
  }

  const onCaseClick = (row: number, col: number) => {
    if (!chessGame) return;
    let board: ChessBoard = chessGame!.getBoard();
    let coordinate: string = String.fromCharCode("a".charCodeAt(0) + row) + (8 - col);
    let piece: ChessPiece | null = board.getPieceAt(coordinate);
    if (playerisWhite && (piece?.color === Color.Black && !legalMoves.includes(coordinate))) return;
    if (!playerisWhite && (piece?.color === Color.White && !legalMoves.includes(coordinate))) return;
    if (legalMoves.includes(coordinate) && selectedCase !== null) {
      if (playerisWhite && chessGame!.getCurrentTurn() === Color.Black) return;
      if (!playerisWhite && chessGame!.getCurrentTurn() === Color.White) return;
      let from = String.fromCharCode("a".charCodeAt(0) + selectedCase.row) + (8 - selectedCase.col);
      let isPawn = board.getPieceAt(from);
      if (isPawn instanceof Pawn) {
        if (col === 0 || col === 7) {
          handleShowPromotion(from, coordinate);
          return;
        }
      }
      let to = coordinate;
      setSelectedCase(null);
      setLegalMoves([]);
      let gameResult = chessGame.makeMove(from, to);
      setDifferentialPiecesWhite(chessGame.getWhitePlayerPiecesTaken());
      boardHistory.push(chessGame.getBoard().copyBoard());
      setCurrentIndex(currentIndex + 1);
      if (gameResult) {
        handleGameEnd(gameResult);
      }
      let newMove = {
        turn: movesData.length + 1,
        white: to,
        whitePiece: chessGame.getBoard().getPieceAt(to),
        black: null,
        blackPiece: null,
      };
      setMovesData((current) => [...current, newMove]);
      handleAiTurn(newMove);
      return;
    }

    if (piece === null) {
      setSelectedCase(null);
      setLegalMoves([]);
      return;
    }
    setSelectedCase({ row: row, col: col });
    const moves = chessGame!.getLegalMovesForPieceAt(coordinate);
    setLegalMoves(moves);
  }

  //TEMPORAIRE DUPLICATION DE CODE
  const renderCase = (row: number, col: number) => {

    const colName = 8 - col;
    const rowName = String.fromCharCode("a".charCodeAt(0) + row);
    const rowCoordsClassName = `row-coordinates ${row % 2 === col % 2 ? "blackText" : "whiteText"}`;
    const colCoordsClassName = `col-coordinates ${row % 2 === col % 2 ? "blackText" : "whiteText"}`;
    const piece: ChessPiece | null = chessGame!.getBoard().getPieceAt(rowName + colName);
    const animationDelay = (((row + col)) * 0.01 + Math.random() * 0.15);

    return (
      <div
        key={`${row}${col}`}
        className={`case ${row % 2 === col % 2 ? "white" : "black"} ${selectedCase?.row === row && selectedCase?.col === col ? "selected" : ""}`}
        style={{ animationDelay: `${animationDelay}s` }}
        onClick={() => onCaseClick(row, col)}
      >
        <div className={rowCoordsClassName}>
          {col === 7 && rowName}
        </div>
        <div className={colCoordsClassName}>
          {row === 0 && colName}
        </div>
        {legalMoves.includes(rowName + colName) && <div className={piece === null ? "legalMouvementCase" : "legalMouvementCasePiece"}></div>}
        <DisplayPiece pieceName={piece} />
      </div>
    );
  };

  const renderRow = (row: number) => {
    const cases = [];
    if (playerisWhite) {
      for (let col = 0; col < 8; col++) {
        cases.push(renderCase(row, col));
      }
    }
    else {
      for (let col = 7; col >= 0; col--) {
        cases.push(renderCase(row, col));
      }
    }
    return (
      <div key={row} className="row">
        {cases}
      </div>
    );
  };


  const renderBoard = () => {
    const rows = [];
    if (playerisWhite) {
      for (let row = 0; row < 8; row++) {
        rows.push(renderRow(row));
      }
    }
    else {
      for (let row = 7; row >= 0; row--) {
        rows.push(renderRow(row));
      }
    }
    return rows;
  };

  return (
    <section className="chessGame">
      {showPromotionPopup && (
        <PopUpPromotion choosePiece={handlePromotion} closePopUp={handleClosePromotion} from={fromToPromotion[0]} to={fromToPromotion[1]} />)
      }
      {showEndPopup && gameEndInfo && (
        <ChessGameEndPopup
          winner={gameEndInfo.winner ? 'Les noirs' : 'Les blancs'}
          playerName1={gameEndInfo.playerName1}
          playerName2={gameEndInfo.playerName2}
          gameType={gameEndInfo.gameType}
          ranking={gameEndInfo.ranking}
          rankingChange={gameEndInfo.rankingChange}
          onNewGame={NewGame} // Implémentez cette fonction pour gérer la création d'une nouvelle partie
          onReturn={BackToMenu} // Implémentez cette fonction pour gérer le retour à l'écran précédent
          idImageP1={0}
          idImageP2={8}
          isPrivate={true}
        />
      )}
      <MovesListMobile moves={movesData} />
      <div className="leftContainer">
        <PlayerContainerAffichage
          isWhitePlayer={false}
          playerName={"AI"}
          playerScore={eloAi}
          playerScorePieceValue={0}
          time="inf"
          idIcon={8}
          lstPiece={differentialPiecesBlack}
        />
        <PlayerContainerAffichage
          isWhitePlayer={true}
          playerName={"Player"}
          playerScore={elo}
          playerScorePieceValue={0}
          time="inf"
          idIcon={0}
          lstPiece={differentialPiecesWhite}
        />
      </div>
      <div className='TopContainer Mobile'>
        <PlayerContainerAffichage
          isWhitePlayer={false}
          playerName={"AI"}
          playerScore={3600}
          playerScorePieceValue={2}
          time="inf"
          enHaut={false}
          idIcon={8}
          lstPiece={differentialPiecesBlack}
        />
      </div>
      <div className="chessBoardContainer">
        <div className="chessBoard">{renderBoard()}</div>
      </div>
      <div className="rightContainer">
        <MovesList moves={movesData} />
        <GameControl
          onLeftClick={PreviousMove}
          onRightClick={NextMove}
        />
        <AbandonButton onClick={Abandon} />
      </div>
      <div className='BotContainer Mobile'>
        <PlayerContainerAffichage
          isWhitePlayer={true}
          playerName={"Player"}
          playerScore={elo}
          playerScorePieceValue={2}
          time="inf"
          idIcon={0}
          lstPiece={differentialPiecesWhite}
        />
      </div>
      <BottomMenuMobile
        onAbandon={Abandon}
        onDraw={() => { }}
        onPreviousMove={PreviousMove}
        onNextMove={NextMove}
      />
    </section>
  );

}

export default GameAI;
