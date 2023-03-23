import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Nt } from '@TRPI/core';
import { eILeaveRoomEvent, PPlayer } from '@TRPI/core/core-network';
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
    const maybeRoom: [string, Nt.Match<PPlayer>] | number =
      this.matchMakingService.queue.addPlayer(data);
    console.log('mm-ranked: Maybe Room : ' + maybeRoom);
    if (typeof maybeRoom === 'number') return null;
    else {
      const [room, match] = maybeRoom;
      this.sockets
        .find((socket) => socket.id === match.players[0].socket)
        .join(room);
      this.sockets
        .find((socket) => socket.id === match.players[1].socket)
        .join(room);
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
  handleLeaveQueue(
    @MessageBody() data: eILeaveRoomEvent,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('mm-ranked: Leave Nt.Queue');
    this.matchMakingService.queue.removePlayer(data.userId, client.id);
  }
}
