import React from 'react';
import { useState } from 'react';
import './GameStyle.css';
import GameControl from '../../components/ChessGame/GameControl';
import NulleButtons from '../../components/Button/NulleButtons';
import PlayerContainer from '../../components/ChessGame/PlayerContainer';
import Chat from '../../components/ChessGame/Chat';
import MovesList from '../../components/ChessGame/TableCoups';
import AbandonButton from '../../components/Button/AbandonButton';
import ChessBoardRenderer from '../../components/ChessGame/ChessBoard';
import { ChessBoard, ChessGame, ChessPiece } from '@TRPI/core/core-algo';
import FindPlayer from '../../components/ChessGame/FindPlayer';
import { useNavigate, useSearchParams } from "react-router-dom";

const Game = () => {

  const navigate = useNavigate();
  
  var playerisWhite = true;

  var movesData = [
    { turn: 1, white: 'e4', black: 'c6' },
    { turn: 2, white: 'Nf3', black: 'd5' },
    { turn: 3, white: 'd4', black: 'Nf6' },
    // Ajouter plus de coups...
  ];

  //get value from url
  const [searchParams] = useSearchParams();
  const RankedMode = searchParams.get('RankedMode');
  const TimerMode = searchParams.get('TimerMode');
  const Pseudo : string | null = searchParams.get('Pseudo');
  const Elo = searchParams.get('Elo');
  console.log("RankedMode : " + RankedMode);
  console.log("TimerMode : " + TimerMode);
  console.log("Pseudo : " + Pseudo);
  console.log("Elo : " + Elo);



  const [PlayerIsFind, setFindPlayer] = useState(false);

  const PlayerFind = (_playerisWhite : boolean) => {
    setFindPlayer(true);
    playerisWhite = _playerisWhite;
  };
  
    //PlayerFind after 2s A ENLEVER
  //setTimeout(PlayerFind, 2000);

  const cancelMatchmaking = () => {
    console.log('cancelMatchmaking');
    navigate('/');
  };

  const chessGame = new ChessGame();

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

  if (!PlayerIsFind) {
    //A MODIFER FAUX ECHIQUIER
    return <div>
      <FindPlayer onCancel={cancelMatchmaking}/>
      <section className="chessGame">
        <div className="leftContainer">
          <PlayerContainer
            isWhitePlayer={true}
            playerName = "Pseudo"
            playerScore={800}
            playerScorePieceValue={2}
            time="10:00"
          />
          <Chat />
          <PlayerContainer
            isWhitePlayer={false}
            playerName="Pseudo"
            playerScore={800}
            playerScorePieceValue={2}
            time="10:00"
          />
        </div>
        <div className="chessBoardContainer">
          <ChessBoardRenderer
            chessGame={chessGame}
            PlayerisWhite = {true}
          />
        </div>
        <div className="rightContainer">
          <MovesList moves={movesData} />
          <GameControl
            onLeftClick={PreviousMove}
            onRightClick={NextMove}
          />
          <AbandonButton onClick={Abandon} />
          <NulleButtons onClick={ProposeNulle} />
        </div>
      </section>
      </div>
  }
  else {
    return (
      <section className="chessGame">
        <div className="leftContainer">
          <PlayerContainer
            isWhitePlayer={true}
            playerName="Pseudo"
            playerScore={800}
            playerScorePieceValue={2}
            time="10:00"
          />
          <Chat />
          <PlayerContainer
            isWhitePlayer={false}
            playerName="Pseudo"
            playerScore={800}
            playerScorePieceValue={2}
            time="10:00"
          />
        </div>
        <div className="chessBoardContainer">
          <ChessBoardRenderer
            chessGame={chessGame}
            PlayerisWhite = {playerisWhite}
          />
        </div>
        <div className="rightContainer">
          <MovesList moves={movesData} />
          <GameControl
            onLeftClick={PreviousMove}
            onRightClick={NextMove}
          />
          <AbandonButton onClick={Abandon} />
          <NulleButtons onClick={ProposeNulle} />
        </div>
      </section>
    );
  }
}

export default Game;
