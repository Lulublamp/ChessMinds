import React from "react";
import { useState } from "react";
import { ChessGame, ChessPiece, ChessBoard } from "@TRPI/core/core-algo";
import DisplayPiece from "./DisplayPiece";
import "./ChessBoardStyle.css";

interface ChessBoardProps {
  chessGame: ChessGame;
  PlayerisWhite: boolean;
}

const ChessBoardRenderer: React.FC<ChessBoardProps> = ({ chessGame, PlayerisWhite }) => {

  const chessBoard = chessGame.getBoard();
  const [selectedCase, setSelectedCase] = useState<{ row: number, col: number } | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);

  const onCaseClick = (row: number, col: number) => {
    let board: ChessBoard = chessGame.getBoard();
    let coordinate: string = String.fromCharCode("a".charCodeAt(0) + row) + (8 - col);
    let piece: ChessPiece | null = board.getPieceAt(coordinate);

    if (legalMoves.includes(coordinate) && selectedCase !== null) {
      let from = String.fromCharCode("a".charCodeAt(0) + selectedCase.row) + (8 - selectedCase.col);
      let to = coordinate;
      //A MODIFIER POUR QUE LE MOUVEMENT SOIT ENVOYER AU SERVEUR
      chessGame.makeMove(from, to);
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
    const moves = chessGame.getLegalMovesForPieceAt(coordinate);
    setLegalMoves(moves);
  }

  const renderCase = (row: number, col: number) => {

    // Ajouter les coordonnées sur la première colonne et la dernière ligne
    const colName = 8 - col;
    const rowName = String.fromCharCode("a".charCodeAt(0) + row);
    const rowCoordsClassName = `row-coordinates ${row % 2 === col % 2 ? "blackText" : "whiteText"}`;
    const colCoordsClassName = `col-coordinates ${row % 2 === col % 2 ? "blackText" : "whiteText"}`;
    const piece: ChessPiece | null = chessBoard.getPieceAt(rowName + colName);

    return (
      <div
        key={`${row}${col}`}
        className={`case ${row % 2 === col % 2 ? "white" : "black"} ${selectedCase?.row === row && selectedCase?.col === col ? "selected" : ""}`}
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

    if (PlayerisWhite) {
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

    if (PlayerisWhite) {
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
