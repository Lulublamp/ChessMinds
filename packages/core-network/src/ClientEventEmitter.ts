import { EVENT_TYPES } from './Event';
import { Socket , io} from "socket.io-client";

export class ClientEventEmitter{

  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  public emitter(event: EVENT_TYPES, data: any) {
    this.socket.emit(event, data);
  }
}