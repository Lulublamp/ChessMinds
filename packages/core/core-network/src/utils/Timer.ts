import { EVENT_TYPES } from "../Event";
import { JoinQueuOption } from "../MatchMaking";
import { MATCHMAKING_MODES_TIMERS } from "../Namespace";
import { Server } from 'socket.io';

export class CTimer {
  public blackTime;
  public whiteTime;
  private server;
  private turn = 0;
  private id: NodeJS.Timer | undefined = undefined;
  private time: number;
  constructor(
    public options: JoinQueuOption,
    public matchId: string,
    server: Server,
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
    if (this.turn === 0 && this.blackTime > 0) {
      timer = setInterval(() => {
        this.blackTime -= 1;
        this.sendData(this.server, this.matchId);
        // console.log('white time: ' + this.blackTime);
        if (this.blackTime <= 0) {
          clearInterval(timer);
          this.server.to(this.matchId).emit(EVENT_TYPES.NO_TIME, 'black');
          this.blackTime = 0;
        }
        if (this.whiteTime <= 0) {
          clearInterval(timer);
          this.server.to(this.matchId).emit(EVENT_TYPES.NO_TIME, 'white');
          this.whiteTime = 0;
        }
      }, 1000);
      ifTimer = true;
    } else if (this.turn === 1 && this.whiteTime > 0) {
      timer = setInterval(() => {
        this.whiteTime -= 1;
        this.sendData(this.server, this.matchId);
        // console.log('black time: ' + this.whiteTime);
        if (this.whiteTime <= 0) {
          clearInterval(timer);
          this.server.to(this.matchId).emit(EVENT_TYPES.NO_TIME, 'white');
          this.whiteTime = 0;
        }
        if (this.blackTime <= 0) {
          clearInterval(timer);
          this.server.to(this.matchId).emit(EVENT_TYPES.NO_TIME, 'black');
          this.blackTime = 0;
        }
      }, 1000);
      ifTimer = true;
    }
    this.turn = this.turn === 0 ? 1 : 0;
    this.id = timer!;
    if (!ifTimer) console.log('no timer finito');
    return timer!;
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
}