import React, { useEffect, useState } from 'react';
import { ChessGame, ChessPiece, ChessBoard, Color, King, Knight, Pawn, Queen, Rook, Bishop } from "@TRPI/core/core-algo";
import DisplayPiece from '../../components/ChessGame/DisplayPiece';
import MovesList from '../../components/ChessGame/TableCoups';
import { Move } from '@TRPI/core/core-network/src/interfaces/receiveEvents';
import { convertNumberToPosition } from './Echiquier';
import GameControl from '../../components/ChessGame/GameControl';
import { useLocation } from 'react-router-dom';
import './Replay.css';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const Replay: React.FC = () => {

  type Coups = {
    from: string,
    to: string
  }

  const [playerIsWhite, setPlayerIsWhite] = useState<boolean>(true);
  const [currentCoup, setCurrentCoup] = useState<number>(0);
  const [moves, setMoves] = useState<Move[]>([]);
  const [moveData, setMovesData] = useState<Coups[]>([]);
  const [chessGame, setChessGame] = useState<ChessGame | null>(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const idRencontre = params.get('idRencontre');

  useEffect(() => {

    setChessGame(new ChessGame());

    const ConvertDataBaseObjectToChessObject = (piece_name: string, color: Color): ChessPiece => {
      switch (piece_name) {
        case 'PION':
          return new Pawn(color, '');
        case 'TOUR':
          return new Rook(color, '');
        case 'CAVALIER':
          return new Knight(color, '');
        case 'FOU':
          return new Bishop(color, '');
        case 'DAME':
          return new Queen(color, '');
        case 'ROI':
          return new King(color, '');
        default:
          throw new Error('Invalid piece name');
      }
    }

    const fetchCoups = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/rencontre-coups/${idRencontre}/coups`);
        const coupsData: any[] = response.data;
        const moves: Move[] = [];
        const movesData: Coups[] = [];

        coupsData.forEach((coup: any) => {
          movesData.push({
            from: convertNumberToPosition(coup.caseSource),
            to: convertNumberToPosition(coup.caseDestination)
          });
        });

        for (let i = 0; i < coupsData.length; i += 2) {
          const whiteCoup = coupsData[i];
          const blackCoup = coupsData[i + 1];

          const move: Move = {
            turn: whiteCoup.ordre,
            white: convertNumberToPosition(whiteCoup.caseDestination),
            whitePiece: ConvertDataBaseObjectToChessObject(whiteCoup.piece, Color.White),
            black: blackCoup ? convertNumberToPosition(blackCoup.caseDestination) : null,
            blackPiece: blackCoup ? ConvertDataBaseObjectToChessObject(blackCoup.piece, Color.Black) : null,
          };

          moves.push(move);
        }
        setMovesData(movesData);
        setMoves(moves);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCoups();
  }, [idRencontre]);

  const PreviousMove = () => {
    if (chessGame && currentCoup > 0) {
      // Créer une nouvelle instance de ChessGame pour remettre le plateau à l'état initial
      const newChessGame = new ChessGame();
      // Rejouer tous les coups jusqu'à l'indice currentCoup - 1
      for (let i = 0; i < currentCoup - 1; i++) {
        const move = moveData[i];
        newChessGame.getBoard().movePiece(move.from, move.to);
      }
      // Mettre à jour l'état chessGame avec le nouveau ChessGame
      setChessGame(newChessGame);
      // Décrémenter l'état currentCoup
      setCurrentCoup(currentCoup - 1);
    }
  }

  const NextMove = () => {
    console.log('Next move');
    if (chessGame && currentCoup < moveData.length) {
      const move = moveData[currentCoup];
      chessGame.getBoard().movePiece(move.from, move.to);
      setCurrentCoup(currentCoup + 1);
    }
  }


  const renderCase = (row: number, col: number) => {

    const colName = 8 - col;
    const rowName = String.fromCharCode("a".charCodeAt(0) + row);
    const rowCoordsClassName = `row-coordinates ${row % 2 === col % 2 ? "blackText" : "whiteText"}`;
    const colCoordsClassName = `col-coordinates ${row % 2 === col % 2 ? "blackText" : "whiteText"}`;
    const piece: ChessPiece | null = chessGame!.getBoard().getPieceAt(rowName + colName);
    const animationDelay = (((row + col)) * 0.01 + Math.random() * 0.15);

    return (
      <div
        key={`${row}${col}`}
        className={`case ${row % 2 === col % 2 ? "white" : "black"}`}
        style={{ animationDelay: `${animationDelay}s` }}
      >
        <div className={rowCoordsClassName}>
          {col === 7 && rowName}
        </div>
        <div className={colCoordsClassName}>
          {row === 0 && colName}
        </div>
        <DisplayPiece pieceName={piece} />
      </div>
    );
  };

  const renderRow = (row: number) => {
    const cases = [];

    if (playerIsWhite) {
      for (let col = 0; col < 8; col++) {
        cases.push(renderCase(row, col));
      }
    }
    else {
      for (let col = 7; col >= 0; col--) {
        cases.push(renderCase(row, col));
      }
    }

    return (
      <div key={row} className="row">
        {cases}
      </div>
    );
  };


  const renderBoard = () => {
    const rows = [];

    if (playerIsWhite) {
      for (let row = 0; row < 8; row++) {
        rows.push(renderRow(row));
      }
    }
    else {
      for (let row = 7; row >= 0; row--) {
        rows.push(renderRow(row));
      }
    }

    return rows;
  };

  if (chessGame === null) return (<div>Chargement...</div>);
  return (
    <div className='Replay'>
      <div className="chessBoardContainer">
        <div className="chessBoard">{renderBoard()}</div>
      </div>
      <div className="rightContainer">
        <MovesList moves={moves} />
        <GameControl
          onLeftClick={PreviousMove}
          onRightClick={NextMove}
        />
      </div>
    </div>);
};

export default Replay;
