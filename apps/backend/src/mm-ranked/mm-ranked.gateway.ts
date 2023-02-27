import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  EVENT_TYPES,
  Match,
  NAMESPACE_TYPES,
  Player,
  Queue,
} from '@TRPI/core-nt';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: NAMESPACE_TYPES.MM_RANKED,
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
    console.log('mm-ranked: Connection : ' + client.id);
  }

  @SubscribeMessage(EVENT_TYPES.JOIN_QUEUE_R)
  handleJoinQueue(
    @MessageBody() data: Player,
    @ConnectedSocket() client: Socket,
  ): null {
    console.log('mm-ranked: Join Queue');
    data.socket = client;
    const maybeRoom: [string, Match] | number = this.queue.addPlayer(data);
    if (typeof maybeRoom === 'number') return null;
    else {
      const [room, match] = maybeRoom;
      match.players.forEach((player) => {
        player.socket?.join(room);
      });
      console.log('mm-ranked: Join Room : ' + room);
      this.server
        .in(room)
        .emit(EVENT_TYPES.INIT_GAME, Queue.excludeSocket(match));
    }
  }

  @SubscribeMessage(EVENT_TYPES.LEAVE_QUEUE_R)
  handleLeaveQueue(@MessageBody() data: any) {
    console.log('mm-ranked: Leave Queue');
    this.queue.removePlayer(data);
    this.server.emit(
      EVENT_TYPES.MATCH_MAKING_STATE_R,
      this.queue.getCoupledPlayers(),
    );
    console.log(
      'mm-ranked: Remove Player : ' + JSON.stringify(this.queue.getPlayers()),
    );
  }
}
