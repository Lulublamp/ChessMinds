import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CoreEvents, CoreNameSpaces, Queue } from '@TRPI/core-nt';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: CoreNameSpaces.MM_RANKED })
export class MmRankedGateway {
  @WebSocketServer()
  server: Server;

  private queue: Queue;

  afterInit() {
    console.log('mm-ranked: Init');
    this.queue = new Queue(4);
  }

  @SubscribeMessage(CoreEvents.JOIN_QUEUE_R)
  handleJoinQueue(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('mm-ranked: Join Queue');
    const l = this.queue.getCoupledPlayers().length;
    this.queue.addPlayer(data);
    this.server.emit(
      CoreEvents.MATCH_MAKING_STATE_R,
      this.queue.getCoupledPlayers(),
    );
    const toPrint =
      l !== this.queue.getCoupledPlayers().length
        ? this.queue.getCoupledPlayers()
        : this.queue.getPlayers();
    console.log('mm-ranked: ', toPrint);
  }
}
