import React, { useEffect } from 'react';
import { useGameInfoContext } from '../ChessGame/GameInfoProvider';
import { useNavigate } from 'react-router-dom';
import { MATCHMAKING_MODES_TIMERS, MATCHMAKING_MODE, ReactSetter } from '@TRPI/core/core-network';
import { useGlobalSocket } from '../../contexts/ContextPublicManager';

interface PlayButtonProps {
  selectedTimeMod: MATCHMAKING_MODES_TIMERS;
  isRanked: MATCHMAKING_MODE;
  lobbyId?: string;
  setPgReady?: ReactSetter<boolean>
  reGame?: boolean;
}

const PlayButton: React.FC<PlayButtonProps> = ({ selectedTimeMod, isRanked , lobbyId , setPgReady , reGame }) => {

  const { setGameInfo } = useGameInfoContext();
  const navigate = useNavigate();

  const globalSocket  = useGlobalSocket();


  useEffect(() => {
    if (reGame)
      handlePlayClick();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reGame]);



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
