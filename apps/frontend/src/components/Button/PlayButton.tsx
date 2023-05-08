import React from 'react';
import { useGameInfoContext } from '../ChessGame/GameInfoProvider';
import { useNavigate } from 'react-router-dom';
import { MATCHMAKING_MODES_TIMERS, MATCHMAKING_MODE } from '@TRPI/core/core-network';
import { useGlobalSocket } from '../../contexts/ContextPublicManager';

interface PlayButtonProps {
  selectedTimeMod: MATCHMAKING_MODES_TIMERS;
  isRanked: MATCHMAKING_MODE;
  lobbyId?: string;
}

const PlayButton: React.FC<PlayButtonProps> = ({ selectedTimeMod, isRanked , lobbyId }) => {

  const { setGameInfo } = useGameInfoContext();
  const navigate = useNavigate();

  const globalSocket  = useGlobalSocket();






  const handlePlayClick = () => {
    if (isRanked === 'private') 
      globalSocket?.sendStartPG({lobbyId: lobbyId!});
    
    setGameInfo(selectedTimeMod, isRanked);
    navigate('/Game');
  };

  return (
    <button onClick={handlePlayClick} className="playbutton">⚔️Jouer</button>
  );
};

export default PlayButton;
