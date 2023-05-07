// Importer les modules nécessaires
import React from 'react';
import './PopUpDraw.css';

interface PopUpDrawProps {
  DrawResponse(response: boolean) : void;
}

const PopUpDraw: React.FC<PopUpDrawProps> = ({ DrawResponse}) => {
  return (
    <div className="PopUpDraw">
      <span>Demande de match nul</span>
      <div>
        <button onClick={() => {DrawResponse(true)}}>Accepter</button>
        <button onClick={() => {DrawResponse(false)}}>Refuser</button>
      </div>
    </div>
  );
};

export default PopUpDraw;
