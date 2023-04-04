import { JoinQueuOption } from "../MatchMaking";
import { MATCHMAKING_MODES_TIMERS } from "../Namespace";



export class Timer {
  private opt: JoinQueuOption;
  private time: number;
  public whiteTime: number;
  public blackTime: number;
  constructor(opt: JoinQueuOption){
    this.opt = opt;
    switch (opt.timer) {
      case MATCHMAKING_MODES_TIMERS.BLITZ:
        this.time = 3;
        break;
      case MATCHMAKING_MODES_TIMERS.BULLET:
        this.time = 1;
        break;
      case MATCHMAKING_MODES_TIMERS.RAPID:
        this.time = 5;
        break;
      default:
        this.time = 0;
        break;
    }
    this.whiteTime = this.time;
    this.blackTime = this.time;
    this.time = this.time * 2;
  }

  public whiteTimer() {
    
  }

  public blackTimer() {

  }

  public resetTimer() {

  }
  

}