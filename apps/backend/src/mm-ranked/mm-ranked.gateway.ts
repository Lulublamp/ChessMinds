import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Nt } from '@TRPI/core';
import { Server, Socket } from 'socket.io';
// EVENT_TYPES,
//   Match,
//   Nt.NAMESPACE_TYPES,
//   Nt.PPlayer,
//   Queue,
@WebSocketGateway({
  namespace: Nt.NAMESPACE_TYPES.MM_RANKED,
  cors: true,
})
export class MmRankedGateway {
  @WebSocketServer()
  server: Server;

  private queue: Nt.Queue;

  afterInit() {
    console.log('mm-ranked: Init');
    this.queue = new Nt.Queue(4);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('mm-ranked: Connection : ' + client.id);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.JOIN_QUEUE_R)
  handleJoinQueue(
    @MessageBody() data: Nt.PPlayer,
    @ConnectedSocket() client: Socket,
  ): null {
    console.log('mm-ranked: Join Nt.Queue');
    data.socket = client;
    const maybeRoom: [string, Nt.Match] | number = this.queue.addPlayer(data);
    if (typeof maybeRoom === 'number') return null;
    else {
      const [room, match] = maybeRoom;
      match.players.forEach((player) => {
        player.socket?.join(room);
      });
      console.log('mm-ranked: Join Room : ' + room);
      this.server
        .in(room)
        .emit(Nt.EVENT_TYPES.INIT_GAME, Nt.Queue.excludeSocket(match));
    }
  }

  @SubscribeMessage(Nt.EVENT_TYPES.LEAVE_QUEUE_R)
  handleLeaveQueue(@MessageBody() data: any) {
    console.log('mm-ranked: Leave Queue');
    this.queue.removePlayer(data);
    this.server.emit(
      Nt.EVENT_TYPES.MATCH_MAKING_STATE_R,
      this.queue.getCoupledPlayers(),
    );
    console.log(
      'mm-ranked: Remove Player : ' + JSON.stringify(this.queue.getPlayers()),
    );
  }
}
