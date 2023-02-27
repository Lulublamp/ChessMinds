import { EVENT_TYPES } from './Event';
import { Socket , io} from "socket.io-client";
import { eICreateRoomEvent, eIInitGameEvent, eIJoinQueueEvent, eILeaveRoomEvent, eIMatchMakingStateEvent } from './interfaces/emitEvents';
import { NAMESPACE_TYPES, MM_RANKED, MM_UNRANKED } from './Namespace';

export type IRespond = eICreateRoomEvent | eILeaveRoomEvent | eIMatchMakingStateEvent | eIInitGameEvent;
type Check<T , R , K>  = T extends R ? K : never;


export class EventEmitter {
  
    readonly socket: Socket;
  
    constructor(socket: Socket) {
      this.socket = socket;
    }

    private _send(event: EVENT_TYPES, data: IRespond) {
      this.socket.emit(event, data , (response: any) => {
        console.log('response ack' , response)
        return response;
      })
    }
  
    protected send(event: EVENT_TYPES, data: IRespond) {
      console.log('typeof data' , typeof data)
      this._send(event, data);
    }

    
}


export class ClientEventManager<T extends NAMESPACE_TYPES> extends EventEmitter{

  private type: T;

  constructor(type: T) {
    const socket = io(`http://localhost:3001/${type}` , {
      // extraHeaders: {
      //   "access_token": 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hcmlhIiwic3ViIjoyLCJpYXQiOjE2NzczNDI5MDgsImV4cCI6MTY3Nzk0NzcwOH0.zBHir7nz76nCU2ez238FY1Px2bBvUxhGV0idj2vVKFY',
      // },
    });
    super(socket);
    this.type = type;
  }

  private validateEmit(arg: any): boolean{
    if (!(this.type == arg)) {
      return false;
    }
    return true;
  }

  public joinMatchMakingEvent(data: Check<T , MM_RANKED , eIJoinQueueEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.MM_RANKED)) return 
    this.send(EVENT_TYPES.JOIN_QUEUE_R, data);
  }

  public leaveMatchMakingEvent(data: Check<T , MM_UNRANKED , eILeaveRoomEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.MM_UNRANKED)) return 
    this.send(EVENT_TYPES.LEAVE_QUEUE_R, data);
  }

  public listenToInitGame(setter: any) {
    this.socket.on(EVENT_TYPES.INIT_GAME, (dat: any) => {
      console.log('data' , dat)
      setter(() => dat);
      setTimeout(() => {
        setter(() => null);
      }, 2000);
    })
  }
  

  public close() {
    this.socket.close();
  }
}