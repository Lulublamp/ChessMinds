import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Nt } from '@TRPI/core';
import {
  eIJoinQueueEvent,
  MATCHMAKING_MODE,
  MMPlayer,
} from '@TRPI/core/core-network';
import { Server, Socket } from 'socket.io';
import { MmRankedService } from '../mm-ranked/mm-ranked.service';
import { MmUnrankedService } from '../mm-unranked/mm-unranked.service';
import { PrivateGameService } from '../private-game/private-game.service';
import { MatchMakingService } from './match-making.service';

@WebSocketGateway({
  namespace: Nt.NAMESPACE_TYPES.MATCH_MAKING,
  cors: true,
})
export class MatchMakingGateway {
  @WebSocketServer()
  server: Server;

  private sockets: Socket[] = [];

  constructor(private matchMakingService: MatchMakingService) {}

  afterInit() {
    console.log('match-making: Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('match-making: Connection : ' + client.id);
    this.sockets.push(client);
  }

  handleDisconnect(client: Socket) {
    console.log('match-making: Disconnect : ' + client.id);
    this.sockets = this.sockets.filter((socket) => socket.id !== client.id);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.JOIN_QUEUE)
  handleJoinQueue(
    @MessageBody() joinQueuPayload: eIJoinQueueEvent,
    @ConnectedSocket() client: Socket,
  ) {
    const { options } = joinQueuPayload;
    const optionQuery: MMPlayer = joinQueuPayload;
    optionQuery.socketId = client.id;
    if (options.mode === MATCHMAKING_MODE.PRIVATE) {
      console.log('error: private game not implemented in queue');
      return;
    }

    const maybeGame = this.matchMakingService.queue.addPlayerToQueue(
      optionQuery,
      client,
      options.mode,
    );

    if (typeof maybeGame === 'number') {
      console.log('match-making: Join Nt.Queue');
      return;
    }

    const socketWhite = maybeGame.white_player.socketId;
    const socketBlack = maybeGame.black_player.socketId;

    this.server
      .to([socketWhite, socketBlack])
      .emit(Nt.EVENT_TYPES.INCOMING_CATCH, maybeGame);
  }
}
