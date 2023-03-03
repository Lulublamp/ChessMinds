import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Nt } from '@TRPI/core';
import { Server, Socket } from 'socket.io';
import { MatchMakingService } from 'src/match-making/match-making.service';
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

  private sockets: Socket[] = [];

  constructor(private matchMakingService: MatchMakingService) {}

  afterInit() {
    console.log('mm-ranked: Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('mm-ranked: Connection : ' + client.id);
    this.sockets.push(client);
  }

  handleDisconnect(client: Socket) {
    console.log('mm-ranked: Disconnect : ' + client.id);
    this.sockets = this.sockets.filter((socket) => socket.id !== client.id);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.JOIN_QUEUE_R)
  handleJoinQueue(
    @MessageBody() data: Nt.PPlayer,
    @ConnectedSocket() client: Socket,
  ): null {
    console.log('mm-ranked: Join Nt.Queue');
    data.socket = client.id;
    const maybeRoom: [string, Nt.Match] | number =
      this.matchMakingService.queue.addPlayer(data);
    console.log('mm-ranked: Maybe Room : ' + maybeRoom);
    if (typeof maybeRoom === 'number') return null;
    else {
      const [room, match] = maybeRoom;
      this.sockets.forEach((socket) => {
        if (socket.id === match.players[0].socket) {
          socket.join(room);
        } else if (socket.id === match.players[1].socket) {
          socket.join(room);
        }
      });
      console.log('mm-ranked: Join Room : ' + room);
      this.server
        .in(room)
        .fetchSockets()
        .then((sockets) => {
          console.log('mm-ranked: Sockets : ' + sockets.length);
          sockets.forEach((socket) => {
            console.log('mm-ranked: Socket : ' + socket.id);
          });
        });
      this.server
        .in(room)
        .emit(Nt.EVENT_TYPES.INIT_GAME, Nt.Queue.excludeSocket(match));
    }
  }

  @SubscribeMessage(Nt.EVENT_TYPES.LEAVE_QUEUE_R)
  handleLeaveQueue(@MessageBody() data: any) {
    console.log('mm-ranked: Leave Queue');
    this.matchMakingService.queue.removePlayer(data);
    this.server.emit(
      Nt.EVENT_TYPES.MATCH_MAKING_STATE_R,
      this.matchMakingService.queue.getCoupledPlayers(),
    );
    console.log(
      'mm-ranked: Remove Player : ' +
        JSON.stringify(this.matchMakingService.queue.getPlayers()),
    );
  }
}
