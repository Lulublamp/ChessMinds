import React from 'react';
import './GameControleStyle.css';

type GameControlProps = {
  onLeftClick: () => void;
  onRightClick: () => void;
}

const GameControl: React.FC<GameControlProps> = ({
  onLeftClick,
  onRightClick,
}) => {
  return (
    <div className="gameControl">
      <button>
        <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onLeftClick}>
          <path d="M13.125 22.5H31.875M13.125 22.5L20.625 15M13.125 22.5L20.625 30M39.375 22.5C39.375 31.8198 31.8198 39.375 22.5 39.375C13.1802 39.375 5.625 31.8198 5.625 22.5C5.625 13.1802 13.1802 5.625 22.5 5.625C31.8198 5.625 39.375 13.1802 39.375 22.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button>
        <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onRightClick}>
          <path d="M31.875 22.5H13.125M31.875 22.5L24.375 30M31.875 22.5L24.375 15M39.375 22.5C39.375 31.8198 31.8198 39.375 22.5 39.375C13.1802 39.375 5.625 31.8198 5.625 22.5C5.625 13.1802 13.1802 5.625 22.5 5.625C31.8198 5.625 39.375 13.1802 39.375 22.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default GameControl;
