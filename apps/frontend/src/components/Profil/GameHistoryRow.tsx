import React from 'react';
import { useNavigate } from 'react-router-dom';

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

  const handleReplay = () => {
    navigate(`/Replay?idRencontre=${id_rencontre}`);
  };

  return (
    <div>
      <div>
        <span>{player1} ({elo1})</span>
        <span>{player2} ({elo2})</span>
      </div>
      <span>{result}</span>
      <button onClick={handleReplay}>Replay</button>
      <span>{nbr_coups}</span>
      <span>{date}</span>
    </div>
  );
};

export default GameHistoryRow;
