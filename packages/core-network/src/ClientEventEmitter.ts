import { CoreEvents, EVENT_TYPES } from './Event';
import { Socket , io} from "socket.io-client";
import { eICreateRoomEvent } from './events/eICreateRoom';
import { eILeaveRoomEvent } from './events/eILeaveRoomEvent';
import { eIMatchMakingStateEvent } from './events/eIMatchMakingStateEvent';
import { eIInitGameEvent } from './events/eIInitGameEvent';




export type IRespond = eICreateRoomEvent | eILeaveRoomEvent | eIMatchMakingStateEvent | eIInitGameEvent;

export class EventEmitter {
  
    readonly socket: Socket;
  
    constructor(socket: Socket) {
      this.socket = socket;
    }

    private _send<T extends EVENT_TYPES>(event: T, data: IRespond) {
      this.socket.emit(event, data , (response: any) => {
        console.log('response ack' , response)
        return response;
      })
    }
  
    protected send<T extends EVENT_TYPES>(event: T, data: IRespond) {
      console.log('typeof data' , typeof data)
      this._send(event, data);
    }
}



export class ClientEventEmitter extends EventEmitter{

  constructor(socket: Socket) {
    super(socket);
  }

  public createRoomEvent(data: eICreateRoomEvent ) {
    this.send(CoreEvents.JOIN_QUEUE_R, data);
  }

  public leaveRoomEvent(data: eILeaveRoomEvent ) {
    this.send(CoreEvents.LEAVE_QUEUE_R, data);
  }

  public matchMakingStateEvent(data: eIMatchMakingStateEvent ) {
    this.send(CoreEvents.MATCH_MAKING_STATE_R, data);
  }

  public initGameEvent(data: eIInitGameEvent ) {
    this.send(CoreEvents.INIT_GAME, data);
  }

  public incomingCatchEvent(data: eICreateRoomEvent ) {
    this.send(CoreEvents.INCOMING_CATCH, data);
  }
}