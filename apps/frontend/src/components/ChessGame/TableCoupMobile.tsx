import React from 'react';
import './TableCoupMobile.css';
import DisplayPiece from "./DisplayPiece";
import { Move } from '@TRPI/core/core-network/src/interfaces/receiveEvents';


interface MovesListProps {
  moves: Move[];
}

const MovesListMobile: React.FC<MovesListProps> = ({ moves }) => {

  return (
    <div className='coupsContainerMobile'>
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

export default MovesListMobile;
