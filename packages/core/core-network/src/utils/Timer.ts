import { EVENT_TYPES } from "../Event";
import { JoinQueuOption } from "../MatchMaking";
import { MATCHMAKING_MODE, MATCHMAKING_MODES_TIMERS } from "../Namespace";
import { Server } from 'socket.io';
import { IGame } from "../interfaces/game";
import { ChessGame } from "../../../core-algo";

enum Echiquier {
  a1 = 11, a2 =12,  a3 = 13, a4 = 14, a5 = 15, a6 = 16, a7 = 17, a8 = 18,
  b1 = 21, b2 = 22, b3 = 23, b4 = 24, b5 = 25, b6 = 26, b7 = 27, b8 = 28,
  c1 = 31, c2 = 32, c3 = 33, c4 = 34, c5 = 35, c6 = 36, c7 = 37, c8 = 38,
  d1 = 41, d2 = 42, d3 = 43, d4 = 44, d5 = 45, d6 = 46, d7 = 47, d8 = 48,
  e1 = 51, e2 = 52, e3 = 53, e4 = 54, e5 = 55, e6 = 56, e7 = 57, e8 = 58,
  f1 = 61, f2 = 62, f3 = 63, f4 = 64, f5 = 65, f6 = 66, f7 = 67, f8 = 68,
  g1 = 71, g2 = 72, g3 = 73, g4 = 74, g5 = 75, g6 = 76, g7 = 77, g8 = 78,
  h1 = 81, h2 = 82, h3 = 83, h4 = 84, h5 = 85, h6 = 86, h7 = 87, h8 = 88,
}

export class CTimer {
  public blackTime;
  public whiteTime;
  private server;
  private turn = 0;
  private id: NodeJS.Timer | undefined = undefined;
  private time: number;
  private matchgame: IGame;
  private rencontreService: any;
  private game : ChessGame;
  constructor(
    public options: JoinQueuOption,
    public matchId: string,
    server: Server,
    getMatch: (matchId: string) => any,
    getRencontreService: () => any,
    getChessGame: (matchId: string) => any
  ) {
    switch (options.timer) {
      case MATCHMAKING_MODES_TIMERS.BULLET:
        this.time = 1 * 60;
        break;
      case MATCHMAKING_MODES_TIMERS.BLITZ:
        this.time = 3 * 60;
        break;
      case MATCHMAKING_MODES_TIMERS.RAPID:
        this.time = 5 * 60;
        break;
      default:
        this.time = 1 * 60;
        break;
    }
    this.matchId = matchId;
    this.blackTime = this.time;
    this.whiteTime = this.time;
    this.server = server;
    this.rencontreService = getRencontreService();
    this.matchgame = getMatch(matchId);
    this.game = getChessGame(matchId);
  }

  public startTimer() {
    this.turn = 0;
  }

  public stopTimer() {
    clearInterval(this.id);
  }

  public continueTimer() {
    if (this.id !== undefined) {
      clearInterval(this.id);
    }
    let ifTimer = false;
    let timer: NodeJS.Timer;
    if (this.turn === 0 && this.blackTime > 0) { // tour blanc
      timer = setInterval(() => {
        this.blackTime -= 1;
        this.sendData(this.server, this.matchId);
        // console.log('white time: ' + this.blackTime);
        if (this.blackTime <= 0) {
          clearInterval(timer);
          this.server.to(this.matchId).emit(EVENT_TYPES.NO_TIME, 'black');
          this.blackTime = 0;
          this.endGame(0);
        }
        if (this.whiteTime <= 0) {
          clearInterval(timer);
          this.server.to(this.matchId).emit(EVENT_TYPES.NO_TIME, 'white');
          this.whiteTime = 0;
          this.endGame(1);
        }
      }, 1000);
      ifTimer = true;
    } else if (this.turn === 1 && this.whiteTime > 0) { // tour noir
      timer = setInterval(() => {
        this.whiteTime -= 1;
        this.sendData(this.server, this.matchId);
        // console.log('black time: ' + this.whiteTime);
        if (this.whiteTime <= 0) {
          clearInterval(timer);
          this.server.to(this.matchId).emit(EVENT_TYPES.NO_TIME, 'white');
          this.whiteTime = 0;
          this.endGame(1);
        }
        if (this.blackTime <= 0) {
          clearInterval(timer);
          this.server.to(this.matchId).emit(EVENT_TYPES.NO_TIME, 'black');
          this.blackTime = 0;
          this.endGame(0);
        }
      }, 1000);
      ifTimer = true;
    }
    this.turn = this.turn === 0 ? 1 : 0;
    this.id = timer!;
    if (!ifTimer) console.log('no timer finito');
    return timer!;
  }

  private async endGame(winner: number) {
    let eloNoir = 0;
    let eloBlanc = 0;
    let neweloBlanc = 0;
    let neweloNoir = 0;
    if (this.matchgame.matchOptions.mode === MATCHMAKING_MODE.RANKED) {
      eloNoir = this.matchgame.black_player.elo;
      eloBlanc = this.matchgame.white_player.elo;
      let kFactorB = this.rencontreService.calculateKFactor(eloBlanc);
      let kFactorN = this.rencontreService.calculateKFactor(eloNoir);
      let scoreBlanc = winner === 0 ? 1 : winner === 0.5 ? 0.5 : 0;
      let scoreNoir = winner === 1 ? 1 : winner === 0.5 ? 0.5 : 0;
      neweloBlanc = this.rencontreService.calculateEloGain({ Elo: eloBlanc, score: scoreBlanc },
        { Elo: eloNoir, score: scoreNoir }, kFactorB);
      neweloNoir = this.rencontreService.calculateEloGain({ Elo: eloNoir, score: scoreNoir },
        { Elo: eloBlanc, score: scoreBlanc }, kFactorN);
    }

    // Sauvegarder la partie
    const rencontre = {
      pseudoJoueurBlanc: this.matchgame.white_player.name,
      pseudoJoueurNoir: this.matchgame.black_player.name,
      vainqueur: winner,
      timer: this.matchgame.matchOptions.timer,
    };

    const coups = this.game.getMovesHistory().map((move, index) => ({
      idRencontre: null, // Cette valeur sera remplacée par l'ID de la rencontre sauvegardée
      caseSource: this.positionToNumber(move.from),
      caseDestination: this.positionToNumber(move.to),
      piece: this.formate_piece(move.piece),
      couleur: this.formate_color(move.color),
      ordre: index + 1
    }));

    try {
      const savedRencontre = await this.rencontreService.saveRencontre(rencontre, this.matchgame.matchOptions.mode === MATCHMAKING_MODE.RANKED);
      for (const coup of coups) {
        coup.idRencontre = savedRencontre;
        await this.rencontreService.saveCoup(coup);
      }
      console.log('Partie sauvegardée avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la partie', error);
    }
  }

  public getData() {
    return {
      whiteTime: this.blackTime,
      blackTime: this.whiteTime,
    };
  }
  
  public sendData(server: Server, matchId: string) {
    server.to(matchId).emit(EVENT_TYPES.TIMER, this.getData());
    server.to(matchId).emit('debug', 'debug ci/cd');
  }

  private positionToNumber(position: string): number | null {
    const positionLower = position.toLowerCase();
    if (!(positionLower in Echiquier)) {
      return null;
    }
    return Echiquier[positionLower as keyof typeof Echiquier];
  }
  
  
  private formate_piece(piecename: string) {
    if (piecename === 'Pawn') return 'PION';
    if (piecename === 'Rook') return 'TOUR';
    if (piecename === 'Knight') return 'CAVALIER';
    if (piecename === 'Bishop') return 'FOU';
    if (piecename === 'Queen') return 'DAME';
    if (piecename === 'King') return 'ROI';
  }
  
  private formate_color(color: number) {
    if (color === 0) return 'BLANC';
    if (color === 1) return 'NOIR';
  }
  
}