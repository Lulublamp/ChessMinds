import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext, User } from '../UserContext';

interface Props {
  player1: string;
  player2: string;
  elo1: number;
  elo2: number;
  result: string;
  date: string;
  nbr_coups: number;
  id_rencontre: number;
}

const GameHistoryRow: React.FC<Props> = ({player1, player2, elo1, elo2, result, date, nbr_coups, id_rencontre}) => {

  const navigate = useNavigate();
  
  const user = useContext(UserContext);

  const handleReplay = () => {
    navigate(`/Replay?idRencontre=${id_rencontre}`);
  };

  return (
    <div>
      <div>
        <span>{player1} ({elo1})</span>
        <span>{player2} ({elo2})</span>
      </div>
      {Number(result) === 0.0 && user.user?.pseudo === player1 
        && <span style={{color : "#47E639"}}>W</span>
      }
      {Number(result) === 0.0 && user.user?.pseudo === player2
        && <span style={{color : "#E63946"}}>L</span>
      }
      {Number(result) === 1.0 && user.user?.pseudo === player1
        && <span style={{color : "#E63946"}}>L</span>
      }
      {Number(result) === 1.0 && user.user?.pseudo === player2
        && <span style={{color : "#47E639"}}>W</span>
      }
      {Number(result) === 0.5 && <span style={{color : "#007DF0"}}>Draw</span>}
      <button onClick={handleReplay}>Replay</button>
      <span>{Math.ceil(nbr_coups/2)}</span>
      <span>{date}</span>
    </div>
  );
};

export default GameHistoryRow;
