import { EVENT_TYPES } from './Event';
import { Socket , io} from "socket.io-client";
import { eICreateRoomEvent, eIInitGameEvent, eIJoinQueueEvent, eILeaveRoomEvent, eIMatchMakingStateEvent } from './interfaces/emitEvents';
import { NAMESPACE_TYPES, MM_RANKED, MM_UNRANKED } from './Namespace';
import { rICreateRoomEvent } from './interfaces/receiveEvents';

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

  constructor(type: T , token: string) {
    const socket = io(`http://localhost:3001/${type}` , {
      transports: ['websocket'],
      auth: {
        'access_token': `Bearer ${token}`
      }
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

  public leaveMatchMakingEvent(data: Check<T , MM_RANKED , eILeaveRoomEvent>) {
    if (!this.validateEmit(NAMESPACE_TYPES.MM_RANKED)) return 
    this.send(EVENT_TYPES.LEAVE_QUEUE_R, data);
  }

  public listenToInitGameOnce(data: Check<T , MM_RANKED , any>) {
    if (!this.validateEmit(NAMESPACE_TYPES.MM_RANKED)) return 
    this.socket.on(EVENT_TYPES.INIT_GAME, (dat: any) => {
      console.log('data' , dat)
      data.setter(() => dat);
      this.socket.off(EVENT_TYPES.INIT_GAME);
    })
  }
  

  public close() {
    this.socket.close();
  }
}