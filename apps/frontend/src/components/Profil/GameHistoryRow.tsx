import React from 'react';

interface Props {
  player1: string;
  player2: string;
  elo1: number;
  elo2: number;
  result: string;
}

const GameHistoryRow: React.FC<Props> = ({player1, player2, elo1, elo2, result}) => {
  return (
    <div>
      <div>
        <span>{player1} ({elo1})</span>
        <span>{player2} ({elo2})</span>
      </div>
      <span>{result}</span>
      <button>Replay</button>
      <span>XX</span>
      <span>XX/XX/XXXX</span>
    </div>
  );
};

export default GameHistoryRow;
