import React from 'react';
import { useGameInfoContext } from '../ChessGame/GameInfoProvider';
import { useNavigate } from 'react-router-dom';
import { MATCHMAKING_MODES_TIMERS, MATCHMAKING_MODE } from '@TRPI/core/core-network';

interface PlayButtonProps {
  selectedTimeMod: MATCHMAKING_MODES_TIMERS;
  isRanked: MATCHMAKING_MODE;
}

const PlayButton: React.FC<PlayButtonProps> = ({ selectedTimeMod, isRanked}) => {

  const { setGameInfo } = useGameInfoContext();
  const navigate = useNavigate();

  const handlePlayClick = () => {
    setGameInfo(selectedTimeMod, isRanked);
    navigate('/Game');
  };

  return (
    <button onClick={handlePlayClick} className="playbutton">⚔️Jouer</button>
  );
};

export default PlayButton;
