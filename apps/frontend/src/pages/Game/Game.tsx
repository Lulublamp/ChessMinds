import React from 'react';
import './GameStyle.css';
import GameControl from '../../components/ChessGame/GameControl';
import NulleButtons from '../../components/Button/NulleButtons';
import PlayerContainer from '../../components/ChessGame/PlayerContainer';
import Chat from '../../components/ChessGame/Chat';
import MovesList from '../../components/ChessGame/TableCoups';
import AbandonButton from '../../components/Button/AbandonButton';

const Game = () => {
  const movesData = [
    { turn: 1, white: 'e4', black: 'c6' },
    { turn: 2, white: 'Nf3', black: 'd5' },
    { turn: 3, white: 'd4', black: 'Nf6' },
    // Ajouter plus de coups...
  ];

  const PreviousMove = () => {
    console.log('Previous move');
  }

  const NextMove = () => {
    console.log('Next move');
  }

  const Abandon = () => {
    console.log('Abandon');
  }

  const ProposeNulle = () => {
    console.log('Propose Nulle');
  }

  return (
    <section className="chessGame">
      <div className="leftContainer">
        <PlayerContainer
          isWhitePlayer={true}
          playerName="Pseudo"
          playerScore={800}
          playerScorePieceValue={2}
        />
        <Chat />
        <PlayerContainer
          isWhitePlayer={false}
          playerName="Pseudo"
          playerScore={800}
          playerScorePieceValue={2}
        />
      </div>
      <div className="chessBoard">

      </div>
      <div className="rightContainer">
        <MovesList moves={movesData} />
        <GameControl
          onLeftClick={PreviousMove}
          onRightClick={NextMove}
        />
        <AbandonButton onClick={Abandon}/>
        <NulleButtons onClick={ProposeNulle}/>
      </div>
    </section>
  );
}

export default Game;
