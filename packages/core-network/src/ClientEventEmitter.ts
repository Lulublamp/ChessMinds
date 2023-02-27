import { CoreEvents, EVENT_TYPES } from './Event';
import { Socket , io} from "socket.io-client";
import { eICreateRoomEvent, eIInitGameEvent, eIJoinQueueEvent, eILeaveRoomEvent, eIMatchMakingStateEvent } from './events/emitEvents';
import { NAMESPACE_TYPES, MM_RANKED, MM_UNRANKED } from './Namespace';

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


export class ClientEventEmitter<T extends NAMESPACE_TYPES> extends EventEmitter{

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

  private validateEmit(arg: NAMESPACE_TYPES): boolean{
    if (!(this.type == arg)) {
      return false;
    }
    return true;
  }

  public joinMatchMakingEvent(data: T extends MM_RANKED ? eIJoinQueueEvent : never) {
    if (!this.validateEmit(NAMESPACE_TYPES.MM_RANKED)) return 
    this.send(CoreEvents.JOIN_QUEUE_R, data);
  }

  public leaveMatchMakingEvent(data: T extends MM_UNRANKED ? eIJoinQueueEvent : never) {
    if (!this.validateEmit(NAMESPACE_TYPES.MM_UNRANKED)) return 
    this.send(CoreEvents.LEAVE_QUEUE_R, data);
  }

  // public createRoomEvent(data: T extends MM_RANKED ? eICreateRoomEvent : never) {
  //   this.validateEmit(data)
  //   this.send(CoreEvents.JOIN_QUEUE_R, data);
  // }

  // public leaveRoomEvent(data: T extends MM_RANKED ? eICreateRoomEvent : never) {
  //   this.send(CoreEvents.LEAVE_QUEUE_R, data);
  // }

  // public matchMakingStateEvent(data: eIMatchMakingStateEvent ) {
  //   this.send(CoreEvents.MATCH_MAKING_STATE_R, data);
  // }

  // public initGameEvent(data: eIInitGameEvent ) {
  //   this.send(CoreEvents.INIT_GAME, data);
  // }

  // public incomingCatchEvent(data: eICreateRoomEvent ) {
  //   this.send(CoreEvents.INCOMING_CATCH, data);
  // }

  // public test(date: T extends null ? eICreateRoomEvent : never) {
  //   this.validateEmit(date)
  //   console.log('test' , date)
  // }
}