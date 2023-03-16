import React from "react";
import { ChessGame } from "@TRPI/core/core-algo";

interface ChessBoardProps {
  chessGame: ChessGame;
  onCaseClick: (row: number, col: number) => void;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ chessGame, onCaseClick }) => {
  const chessBoard = chessGame.getBoard();

  const renderCase = (row: number, col: number) => {
    //const piece = chessBoard[row][col];

    return (
      <div
        key={`${row}${col}`}
        className="case"
        onClick={() => onCaseClick(row, col)}
      >
      </div>
    );
  };

  const renderRow = (row: number) => {
    const cases = [];

    for (let col = 0; col < 8; col++) {
      cases.push(renderCase(row, col));
    }

    return (
      <div key={row} className="row">
        {cases}
      </div>
    );
  };

  const renderBoard = () => {
    const rows = [];

    for (let row = 0; row < 8; row++) {
      rows.push(renderRow(row));
    }

    return rows;
  };

  return <div className="chessBoard">{renderBoard()}</div>;
};

export default ChessBoard;
