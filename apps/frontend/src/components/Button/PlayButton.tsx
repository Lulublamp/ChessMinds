import React from 'react';
import { useGameInfoContext } from '../ChessGame/GameInfoProvider';
import { useNavigate } from 'react-router-dom';
import { MATCHMAKING_MODES_TIMERS, MATCHMAKING_MODE, ReactSetter } from '@TRPI/core/core-network';
import { useGlobalSocket } from '../../contexts/ContextPublicManager';

interface PlayButtonProps {
  selectedTimeMod: MATCHMAKING_MODES_TIMERS;
  isRanked: MATCHMAKING_MODE;
  lobbyId?: string;
  setPgReady?: ReactSetter<boolean>
}

const PlayButton: React.FC<PlayButtonProps> = ({ selectedTimeMod, isRanked , lobbyId , setPgReady }) => {

  const { setGameInfo } = useGameInfoContext();
  const navigate = useNavigate();

  const globalSocket  = useGlobalSocket();






  const handlePlayClick = () => {
    setGameInfo(selectedTimeMod, isRanked);
    if (isRanked === 'private'){
      setPgReady!(true);
      globalSocket?.sendStartPG({lobbyId: lobbyId!});
      navigate(`/Game?id=${lobbyId}`);
    } else {
      navigate('/Game');
    }
  };

  return (
    <button onClick={handlePlayClick} className="playbutton">⚔️Jouer</button>
  );
};

export default PlayButton;
