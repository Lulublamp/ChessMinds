import React, { useEffect } from "react";
import { Bishop, ChessPiece, Color, King, Knight, Pawn, Queen, Rook } from "@TRPI/core/core-algo";
import "./PlayerContainerStyle.css"
import { useFPayload, useGameManager, usePlayerIsWhite } from "../../contexts/GameContext";
import { JoinQueuOption } from "@TRPI/core/core-network/src/MatchMaking";
import { MATCHMAKING_MODES_TIMERS } from "@TRPI/core/core-network";
import ProfileImage from "../Logo_Icon/ProfileImage";
import DisplayPiece from "./DisplayPiece";

interface PlayerContainerProps {
  isWhitePlayer: boolean;
  playerName: string | undefined;
  playerScore: number | undefined;
  playerScorePieceValue: number;
  lstPiece: Map<string, number> | null;
  time: string;
  enHaut?: boolean;
  idIcon: number;
}

export const PlayerContainerAffichage: React.FC<PlayerContainerProps> = ({
  isWhitePlayer,
  playerName,
  playerScore,
  playerScorePieceValue,
  time,
  idIcon,
  lstPiece
}) => {

  const convertStringToPiece = (piece: string): ChessPiece => {
    switch (piece) {
      case "p":
        return new Pawn(isWhitePlayer ? Color.White : Color.Black, "");
      case "r":
        return new Rook(isWhitePlayer ? Color.White : Color.Black, "");
      case "n":
        return new Knight(isWhitePlayer ? Color.White : Color.Black, "");
      case "b":
        return new Bishop(isWhitePlayer ? Color.White : Color.Black, "");
      case "q":
        return new Queen(isWhitePlayer ? Color.White : Color.Black, "");
      default:
        throw new Error("Piece not found");
    }
  }

  return (
    <div className={`playerContainer ${isWhitePlayer ? "whitePlayer" : "blackPlayer"}`}>
      <div>
        <div>
          <ProfileImage id={idIcon} alt="Icon Player 1" />
          <div>
            <span>{playerName}</span>
            <span>{playerScore}</span>
          </div>
        </div>
        <div>
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.9995 13.4314H14.9995C15.2647 13.4314 15.5191 13.5368 15.7066 13.7243C15.8942 13.9118 15.9995 14.1662 15.9995 14.4314C15.9995 14.6966 15.8942 14.951 15.7066 15.1385C15.5191 15.326 15.2647 15.4314 14.9995 15.4314H11.9995C11.8681 15.4318 11.7379 15.4062 11.6164 15.3561C11.4949 15.306 11.3845 15.2323 11.2915 15.1394C11.1986 15.0464 11.125 14.9361 11.0748 14.8145C11.0247 14.693 10.9991 14.5628 10.9995 14.4314V10.4314C10.9995 10.1662 11.1049 9.91183 11.2924 9.72429C11.48 9.53675 11.7343 9.4314 11.9995 9.4314C12.2647 9.4314 12.5191 9.53675 12.7066 9.72429C12.8942 9.91183 12.9995 10.1662 12.9995 10.4314V13.4314ZM5.86853 9.2924C5.64004 9.18643 5.44191 9.02463 5.29242 8.82193C5.14293 8.61923 5.04689 8.38215 5.01315 8.13255C4.97941 7.88296 5.00907 7.62888 5.09938 7.39377C5.18969 7.15865 5.33775 6.95006 5.5299 6.78723C5.72206 6.6244 5.95212 6.51258 6.19887 6.46208C6.44562 6.41158 6.70111 6.42403 6.94179 6.49827C7.18246 6.57251 7.40057 6.70616 7.57599 6.88689C7.75141 7.06762 7.87849 7.28962 7.94553 7.5324C8.3059 7.32047 8.6824 7.13724 9.07153 6.9844C8.63419 6.6805 8.30533 6.24488 8.13286 5.74102C7.96039 5.23716 7.95333 4.69139 8.1127 4.18323C8.27208 3.67508 8.58957 3.2311 9.0189 2.91599C9.44823 2.60088 9.96697 2.4311 10.4995 2.4314H13.4995C14.0321 2.4311 14.5508 2.60088 14.9802 2.91599C15.4095 3.2311 15.727 3.67508 15.8864 4.18323C16.0457 4.69139 16.0387 5.23716 15.8662 5.74102C15.6937 6.24488 15.3649 6.6805 14.9275 6.9844C15.3175 7.1384 15.6945 7.3214 16.0535 7.5324C16.1206 7.28962 16.2476 7.06762 16.4231 6.88689C16.5985 6.70616 16.8166 6.57251 17.0573 6.49827C17.2979 6.42403 17.5534 6.41158 17.8002 6.46208C18.0469 6.51258 18.277 6.6244 18.4692 6.78723C18.6613 6.95006 18.8094 7.15865 18.8997 7.39377C18.99 7.62888 19.0196 7.88296 18.9859 8.13255C18.9522 8.38215 18.8561 8.61923 18.7066 8.82193C18.5571 9.02463 18.359 9.18643 18.1305 9.2924C19.1084 10.4592 19.733 11.8809 19.9311 13.3904C20.1291 14.8999 19.8923 16.4345 19.2485 17.8141C18.6046 19.1937 17.5805 20.3609 16.2964 21.1787C15.0123 21.9965 13.5215 22.4309 11.999 22.4309C10.4766 22.4309 8.98579 21.9965 7.70166 21.1787C6.41754 20.3609 5.39343 19.1937 4.7496 17.8141C4.10577 16.4345 3.86897 14.8999 4.06699 13.3904C4.26501 11.8809 4.89065 10.4592 5.86853 9.2924ZM11.9995 20.4314C13.5908 20.4314 15.117 19.7993 16.2422 18.674C17.3674 17.5488 17.9995 16.0227 17.9995 14.4314C17.9995 12.8401 17.3674 11.314 16.2422 10.1888C15.117 9.06354 13.5908 8.4314 11.9995 8.4314C10.4082 8.4314 8.88211 9.06354 7.75689 10.1888C6.63167 11.314 5.99953 12.8401 5.99953 14.4314C5.99953 16.0227 6.63167 17.5488 7.75689 18.674C8.88211 19.7993 10.4082 20.4314 11.9995 20.4314ZM10.4995 4.4314C10.3669 4.4314 10.2397 4.48408 10.146 4.57784C10.0522 4.67161 9.99953 4.79879 9.99953 4.9314C9.99953 5.06401 10.0522 5.19118 10.146 5.28495C10.2397 5.37872 10.3669 5.4314 10.4995 5.4314H13.4995C13.6321 5.4314 13.7593 5.37872 13.8531 5.28495C13.9468 5.19118 13.9995 5.06401 13.9995 4.9314C13.9995 4.79879 13.9468 4.67161 13.8531 4.57784C13.7593 4.48408 13.6321 4.4314 13.4995 4.4314H10.4995Z"
              fill="black" />
          </svg>
          <span className="time">{time}</span>
        </div>
      </div>
      <div>
        {lstPiece && Array.from(lstPiece.entries()).map(([piece, count]) => (
          Array.from({ length: count }).map((_, i) => (
            <DisplayPiece key={`${piece}-${i}`} pieceName={convertStringToPiece(piece)} />
          ))
        ))}
        {
          playerScorePieceValue > 0 && <span className="scorePieceValue">{`+${playerScorePieceValue}`}</span>
        }
      </div>
    </div>
  );
};

const PlayerContainer: React.FC<PlayerContainerProps> = ({
  isWhitePlayer,
  playerName,
  playerScore,
  enHaut,
  idIcon,
  lstPiece,
}) => {
  const fpayload = useFPayload();
  const [gameManager, setGameManager] = useGameManager();
  const [timer, setTimer] = React.useState(fpayload?.options.timer.toString());
  const [playerScorePieceValue, setPlayerScorePieceValue] = React.useState(0);

  const pieceValues: { [key: string]: number } = {
    "p": 1,
    "r": 5,
    "n": 3,
    "b": 3,
    "q": 9
  };

  useEffect(() => {
    console.log('payload changed');
  }, [fpayload])

  useEffect(() => {
    if (!lstPiece) return;
    let totalScore = 0;
    lstPiece.forEach((value, key) => {
      totalScore += pieceValues[key] * value;
    });
    if(totalScore < 0) totalScore = 0;
    setPlayerScorePieceValue(totalScore);
  }, [lstPiece?.values()])

  useEffect(() => {
    if (gameManager) {
      gameManager.listenToTime({
        timeSetter: setTimer,
        time: timer,
        id: isWhitePlayer ? enHaut ? 'white' : 'black' : enHaut ? 'black' : 'white',
      })
    }

  }, [gameManager])

  return (
    <PlayerContainerAffichage
      isWhitePlayer={isWhitePlayer}
      playerName={playerName}
      playerScore={playerScore}
      playerScorePieceValue={playerScorePieceValue}
      time={timer}
      idIcon={idIcon}
      lstPiece={lstPiece}
    />)
};

export default PlayerContainer;
