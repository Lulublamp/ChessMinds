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
  IGame,
  MATCHMAKING_MODE,
  MMPlayer,
} from '@TRPI/core/core-network';
import { Server, Socket } from 'socket.io';

import { MatchMakingService } from './match-making.service';
import { ChessGame } from '@TRPI/core/core-algo';

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

  handleConnection(client: Socket) {
    console.log('match-making: Connection : ' + client.id);
    this.sockets.push(client);
  }

  handleDisconnect(client: Socket) {
    console.log('match-making: Disconnect : ' + client.id);
    this.matchMakingService.queue.gamesList.forEach((game) => {
      console.log('game : ' + game);
    });

    this.matchMakingService.queue.queueList.forEach((player) => {
      console.log('player : ');
      console.log(player);
    });

    this.matchMakingService.queue.socketMaps.forEach((socket) => {
      console.log('socket : ' + socket);
    });

    this.sockets = this.sockets.filter((socket) => socket.id !== client.id);
    this.matchMakingService.queue.removePlayerFromQueue(client.id);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.JOIN_QUEUE)
  handleJoinQueue(
    @MessageBody() joinQueuPayload: Nt.eIJoinQueueEvent,
    @ConnectedSocket() client: Socket,
  ) {
    const { options } = joinQueuPayload;
    const playerPayload: Nt.MMPlayer = joinQueuPayload;
    playerPayload.socketId = client.id;
    if (options.mode === Nt.MATCHMAKING_MODE.PRIVATE) {
      console.log('error: private game not implemented in queue');
      return;
    }
    console.log('playerPayload : ');
    console.log(playerPayload);
    const maybeGame = this.matchMakingService.queue.addPlayerToQueue(
      playerPayload,
      client.id,
      options,
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
