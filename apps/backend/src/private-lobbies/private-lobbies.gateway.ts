import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Nt } from '@TRPI/core';
import { eIJoinLobbyEvent, PPlayer } from '@TRPI/core/core-network';
import { Server, Socket } from 'socket.io';
import { LobbiesService } from './private-lobbies.service';

@WebSocketGateway({
  namespace: Nt.NAMESPACE_TYPES.PRIVATE_LOBBY,
  cors: true,
})

export class PrivateLobbiesGateway {
  @WebSocketServer()
  server: Server;

  private sockets: Socket[] = [];

  constructor(private lobbiesService: LobbiesService) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Lobbies: Connection : ' + client.id);
    this.sockets.push(client);
  }

  handleDisconnect(client: Socket) {
    console.log('Lobbies: Disconnect : ' + client.id);
    this.sockets = this.sockets.filter((socket) => socket.id !== client.id);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.CREATE_LOBBY)
  handleCreatePrivateLobby(
    @MessageBody() data: Nt.PPlayer,
    @ConnectedSocket() client: Socket,
  ): null {
    console.log('Lobbies: Create Private Lobby');
    data.socket = client.id;
    const lobby = this.lobbiesService.pLobby.createLobby(data);
    client.join(lobby.code);
    return null;
  }


  @SubscribeMessage(Nt.EVENT_TYPES.JOIN_LOBBY)
  handleJoinPrivateLobby(
    @MessageBody() data: eIJoinLobbyEvent,
    @ConnectedSocket() client: Socket,
  ): null {
    console.log('Lobbies: Join Private Lobby');
    const lobby = this.lobbiesService.pLobby.joinLobby(data.code, data.player);
    client.join(lobby.code);
    this.server
    .in(lobby.code)
    .emit(Nt.EVENT_TYPES.LOBBY_PLAYERS_UPDATE, lobby);
    return null;
  }

  @SubscribeMessage(Nt.EVENT_TYPES.LEAVE_LOBBY)
  handleLeavePrivateLobby(
    @MessageBody() data: eIJoinLobbyEvent,
    @ConnectedSocket() client: Socket,
  ): null {
    console.log('Lobbies: Leave Private Lobby');
    const lobby = this.lobbiesService.pLobby.leaveLobby(data.code, data.player);
    client.leave(lobby.code);
    this.server
    .in(lobby.code)
    .emit(Nt.EVENT_TYPES.LOBBY_PLAYERS_UPDATE, lobby);
    return null;
  }

  @SubscribeMessage(Nt.EVENT_TYPES.LOBBY_START_GAME)
  handleStartPrivateLobby(
    @MessageBody() data: eIJoinLobbyEvent,
    @ConnectedSocket() client: Socket,
  ): null {
    console.log('Lobbies: Start Private Lobby');
    const match = this.lobbiesService.pLobby.startGame(data.code);
    if(!match) return null;
    this.server
        .in(data.code)
        .emit(Nt.EVENT_TYPES.INIT_GAME, match);
    return null;
  }

  @SubscribeMessage(Nt.EVENT_TYPES.LOBBY_PLAYER_READY)
  handlePlayerReady(
    @MessageBody() data: PPlayer,
    @ConnectedSocket() client: Socket,
  ): null {
    console.log('Lobbies: Player Ready');
    const lobby = this.lobbiesService.pLobby.playerReady(data);
    this.server
    .in(lobby.code)
    .emit(Nt.EVENT_TYPES.LOBBY_PLAYERS_UPDATE, lobby);
    return null;
  }

  @SubscribeMessage(Nt.EVENT_TYPES.LOBBY_PLAYER_UNREADY)
  handlePlayerUnready(
    @MessageBody() data: PPlayer,
    @ConnectedSocket() client: Socket,
  ): null {
    console.log('Lobbies: Player Unready');
    const lobby = this.lobbiesService.pLobby.playerUnready(data);
    this.server
    .in(lobby.code)
    .emit(Nt.EVENT_TYPES.LOBBY_PLAYERS_UPDATE, lobby);
    return null;
  }
}


