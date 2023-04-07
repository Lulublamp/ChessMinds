import React, { useEffect } from "react";
import { useState } from "react";
import { ChessGame, ChessPiece, ChessBoard, Color } from "@TRPI/core/core-algo";
import DisplayPiece from "./DisplayPiece";
import "./ChessBoardStyle.css";
import { ClientEventManager, IN_GAME } from "@TRPI/core/core-network";
import { useGameManager, useMovesData, usePlayerIsWhite, useIndex, useBoardHistory,useChessGame, useGame , useFPayload}  from "../../contexts/GameContext";
import { random } from "lodash";



const ChessBoardRenderer: React.FC = () => {

  const playerIsWhite = usePlayerIsWhite()
  const [gameManager , setGameManager] = useGameManager();
  const [movesData , setMovesData] = useMovesData();
  const [currentIndex , setCurrentIndex] = useIndex();
  const [boardHistory , setBoardHistory] = useBoardHistory();
  const [chessGame , setChessGame] = useChessGame();
  const [_game , set_Game] = useGame();
  const fpayload = useFPayload();

  const [selectedCase, setSelectedCase] = useState<{ row: number, col: number } | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [_fu , _forceUpdate] = useState(0);
  
  useEffect(() => {
    console.log('updating game manager');
    console.log(chessGame);
    gameManager?.listenToNetworkMove({
      _forceUpdate,
      chessGame : chessGame!,
      setMovesData,
      setCurrentIndex,
      movesData,
      boardHistory,
    })
    console.log(gameManager);
  }, [_game])

  useEffect(() => {
    console.log('force updating');
  }, [_fu])


  useEffect(() => {
    console.log('updating moves data');
  }, [movesData])

  const onCaseClick = (row: number, col: number) => {
    let board: ChessBoard = chessGame!.getBoard();
    let coordinate: string = String.fromCharCode("a".charCodeAt(0) + row) + (8 - col);
    let piece: ChessPiece | null = board.getPieceAt(coordinate);
    if (playerIsWhite && (piece?.color === Color.Black && !legalMoves.includes(coordinate))) return;
    if (!playerIsWhite && (piece?.color === Color.White && !legalMoves.includes(coordinate))) return;

    if (legalMoves.includes(coordinate) && selectedCase !== null) {
      if (playerIsWhite && chessGame!.getCurrentTurn() === Color.Black) return;
      if (!playerIsWhite && chessGame!.getCurrentTurn() === Color.White) return;
      let from = String.fromCharCode("a".charCodeAt(0) + selectedCase.row) + (8 - selectedCase.col);
      let to = coordinate;
      if (boardHistory.length == 1) {
        console.log('first move network')
        gameManager?.firstMove({
          matchId: _game!.matchId,
          options: fpayload.options,
        });
      }
      console.log(boardHistory.length)
      gameManager?.networkMove({
        from, to
    });
      // chessGame.makeMove(from, to);
      setSelectedCase(null);
      setLegalMoves([]);
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

  const renderCase = (row: number, col: number) => {

    // Ajouter les coordonnées sur la première colonne et la dernière ligne
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

    if (playerIsWhite) {
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

    if (playerIsWhite) {
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

  return <div className="chessBoard">{renderBoard()}</div>;
};

export default ChessBoardRenderer;

