import React from 'react';
import './TableCoupsStyle.css';
import { ChessPiece } from "@TRPI/core/core-algo";
import DisplayPiece from "./DisplayPiece";

export interface Move {
  turn: number;
  white: string | null;
  whitePiece: ChessPiece | null;
  black: string | null;
  blackPiece: ChessPiece | null;
}

interface MovesListProps {
  moves: Move[];
}

const MovesList: React.FC<MovesListProps> = ({ moves }) => {
    
  return (
    <div className="coupsContainer">
      {moves.map((move) => (
        <div key={move.turn}>
          <div>{move.turn}</div>
          <div>
            <DisplayPiece pieceName={move.whitePiece} />
            {move.white}
          </div>
          <div>
            <DisplayPiece pieceName={move.blackPiece} />
            {move.black}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovesList;
