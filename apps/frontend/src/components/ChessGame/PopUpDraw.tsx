// Importer les modules nécessaires
import React from 'react';
import './PopUpDraw.css';

interface PopUpDrawProps {
  onAccept: () => void;
  onReject: () => void;
}

const PopUpDraw: React.FC<PopUpDrawProps> = ({ onAccept, onReject }) => {
  return (
    <div className="PopUpDraw">
      <span>Demande de match nul</span>
      <div>
        <button onClick={onAccept}>Accepter</button>
        <button onClick={onReject}>Refuser</button>
      </div>
    </div>
  );
};

export default PopUpDraw;
