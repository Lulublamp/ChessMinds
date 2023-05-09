import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Nt } from '@TRPI/core';
import { Server, Socket } from 'socket.io';

import { MatchMakingService } from './match-making.service';
import { ChessGame } from '@TRPI/core/core-algo';
import { IRPlayer } from '@TRPI/core/core-network';

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

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('match-making: Connection : ' + client.id);
    // console.log(client);
    // console.log('User : ' + client['user']);
    this.sockets.push(client);
  }

  handleDisconnect(client: Socket) {
    console.log('match-making: Disconnect : ' + client.id);
    this.sockets = this.sockets.filter((socket) => socket.id !== client.id);
    this.matchMakingService.queue.removePlayerFromQueue(client.id);
    console.log(this.matchMakingService.queue.coupledGamesMap);
    console.log(this.matchMakingService.queue.queueList);
    console.log(this.matchMakingService.queue.gamesList);
    console.log(this.matchMakingService.queue.socketMaps);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.JOIN_QUEUE)
  handleJoinQueue(
    @MessageBody() joinQueuPayload: Nt.eIJoinQueueEvent,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('match-making: User join queue');
    // console.log(client['user']);
    const { options, lobbyId } = joinQueuPayload;
    const player: Nt.IMMPlayer = this.matchMakingService.mapPlayer(
      client['user'],
      options,
    );
    // console.log('player : ');
    // console.log(player);
    // console.log('playerPayload : ');
    // console.log(playerPayload);
    const maybeGame = this.matchMakingService.queue.addPlayerToQueue(
      player,
      client.id,
    );

    if (typeof maybeGame === 'number') {
      console.log('match-making: Join Nt.Queue');
      return;
    }

    const socketWhite = (maybeGame.white_player as IRPlayer).socketId;
    const socketBlack = (maybeGame.black_player as IRPlayer).socketId;

    this.server
      .to([socketWhite, socketBlack])
      .emit(Nt.EVENT_TYPES.INCOMING_CATCH, maybeGame);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.JOIN_PG_QUEUE)
  handleJoinPGQueue(
    @MessageBody() joinQueuPayload: Nt.eIJoinQueueEvent,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('match-making: User join private queue');
    const { lobbyId } = joinQueuPayload;
    if (joinQueuPayload.lobbyId === undefined)
      throw new Error('LobbyId is undefined');
    const pg = this.matchMakingService.queue.gamesList.find(
      (game) => game.matchId === lobbyId,
    );
    if (pg === undefined) {
      console.log('private game not found');
      return;
    }
    this.matchMakingService.queue.mutateGameSocketId(
      pg.matchId,
      client.id,
      client['user'].user.pseudo,
    );
    console.log('private game found --> : ', pg);
    const socketWhite = (pg.white_player as IRPlayer).socketId;
    const socketBlack = (pg.black_player as IRPlayer).socketId;
    this.server
      .to([socketWhite, socketBlack])
      .emit(Nt.EVENT_TYPES.INCOMING_CATCH, pg);
    return;
  }
}
