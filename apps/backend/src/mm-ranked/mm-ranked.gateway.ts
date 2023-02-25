import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CoreEvents, CoreNameSpaces, Queue } from '@TRPI/core-nt';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: CoreNameSpaces.MM_RANKED,
  transports: ['websocket'],
  cors: true,
})
export class MmRankedGateway {
  @WebSocketServer()
  server: Server;

  private queue: Queue;

  afterInit() {
    console.log('mm-ranked: Init');
    this.queue = new Queue(4);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('mm-ranked: Connection');
    console.log(client.id);
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
    l !== this.queue.getCoupledPlayers().length
      ? console.log(
          'mm-ranked: Match : ' +
            JSON.stringify(this.queue.getCoupledPlayers()),
        )
      : console.log(
          'mm-ranked: Add Player : ' + JSON.stringify(this.queue.getPlayers()),
        );
  }

  @SubscribeMessage(CoreEvents.LEAVE_QUEUE_R)
  handleLeaveQueue(@MessageBody() data: any) {
    console.log('mm-ranked: Leave Queue');
    this.queue.removePlayer(data);
    this.server.emit(
      CoreEvents.MATCH_MAKING_STATE_R,
      this.queue.getCoupledPlayers(),
    );
    console.log(
      'mm-ranked: Remove Player : ' + JSON.stringify(this.queue.getPlayers()),
    );
  }
}
