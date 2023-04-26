import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Nt } from '@TRPI/core';
import { Server, Socket } from 'socket.io';
import { JoueursService } from 'src/joueurs/joueurs.service';
import { PrivateGameService } from './private-game.service';

@WebSocketGateway({
  namespace: Nt.NAMESPACE_TYPES.PRIVATE_GAME,
  cors: true,
})
export class PrivateGameGateway {
  @WebSocketServer()
  server: Server;

  private sockets: Socket[] = [];

  constructor(private joueursService: JoueursService, private gameService : PrivateGameService) {}

  async handleConnection(client: Socket, ...args: any[]) {
    if(this.sockets.find((socket) => socket['user'].user.idJoueur === client['user'].user.idJoueur)){
      console.log('Lobbies: Connection : ' + client['user'].user.pseudo + ' (already connected)');
      client.disconnect();
    }
    this.sockets.push(client);
    // Notify all friends that the player is online
    const playerFriends = await this.joueursService.getAmis(client['user'].user);
    const friendSockets = playerFriends.map((friend) => {
      const friendSocket = this.sockets.find((socket) => socket['user'].user.idJoueur === friend.idJoueur);
      if(friendSocket){
        this.server.to(friendSocket.id).emit(Nt.EVENT_TYPES.AMIS_ONLINE, client['user'].user.idJoueur);
      }
    });
    
  }

  async handleDisconnect(client: Socket) {
    this.sockets = this.sockets.filter((socket) => socket.id !== client.id);
    // Notify all friends that the player is offline
    const playerFriends = await this.joueursService.getAmis(client['user'].user);
    const friendSockets = playerFriends.map((friend) => {
      const friendSocket = this.sockets.find((socket) => socket['user'].user.idJoueur === friend.idJoueur);
      if(friendSocket){
        this.server.to(friendSocket.id).emit(Nt.EVENT_TYPES.AMIS_OFFLINE, client['user'].user.idJoueur);
      }
    });
    const lobbyId = this.gameService.leaveOnDisconnect(client['user'].user.idJoueur);
    if(lobbyId){
      this.server.to(lobbyId).emit(Nt.EVENT_TYPES.LEAVE_LOBBY);
    }
  }


  @SubscribeMessage(Nt.EVENT_TYPES.GET_AMIS_WITH_STATUS)
  async handleGetAmisWithStatus(
    @ConnectedSocket() client: Socket,
  ) {
    const playerFriends = await this.joueursService.getAmis(client['user'].user);
    const playerFriendsWithStatus = playerFriends.map((friend) => {
      const friendSocket = this.sockets.find((socket) => socket['user'].user.idJoueur === friend.idJoueur);
      return {
        ...friend,
        status: friendSocket ? 'online' : 'offline',
      };
    });
    return playerFriendsWithStatus;
  }

  @SubscribeMessage(Nt.EVENT_TYPES.INVITE_AMI)
  handleInviteAmis(
    @MessageBody() inviteAmisPayload: Nt.eIInviteAmisEvent,
    @ConnectedSocket() client: Socket,
  ) {
    const idJoueur = Number(inviteAmisPayload.idJoueur);
    const friendSocket = this.sockets.find((socket) => socket['user'].user.idJoueur === idJoueur);
    if(!friendSocket){
      console.log("Friend not found or offline");
      return;
    }
    this.server.to(friendSocket.id).emit(Nt.EVENT_TYPES.INVITE_AMI, client['user'].user);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.INVITATION_RESPONSE)
  handleInvitationResponse(
    @MessageBody() invitationResponsePayload: Nt.eIInvitationResponseEvent,
    @ConnectedSocket() client: Socket,
  ) {
    const friendSocket = this.sockets.find((socket) => socket['user'].user.idJoueur === invitationResponsePayload.joueur.idJoueur);
    if(!friendSocket){
      console.log("Friend not found or offline");
      return;
    }
    
    const lobbyPayload = {
      ...invitationResponsePayload,
      lobby: null,
    };
    
    if(invitationResponsePayload.response === true){
      const lobby = this.gameService.createLobby(invitationResponsePayload.joueur, client['user'].user);
      lobbyPayload.lobby = lobby;
      client.join(lobby.id);
      friendSocket.join(lobby.id);
      this.server.to(lobby.id).emit(Nt.EVENT_TYPES.INVITATION_RESPONSE, lobbyPayload);
    }
    else{
      this.server.to(friendSocket.id).emit(Nt.EVENT_TYPES.INVITATION_RESPONSE, lobbyPayload);
    }
  }

  @SubscribeMessage(Nt.EVENT_TYPES.LEAVE_LOBBY)
  handleLeaveLobby(
    @MessageBody() leaveLobbyPayload: Nt.eILobbyPlayerReadyEvent,
    @ConnectedSocket() client: Socket,
  ) {
    try{
      this.gameService.leaveLobby(leaveLobbyPayload.lobbyId);
    }
    catch(e){
      console.log(e);
    }
    client.to(leaveLobbyPayload.lobbyId).emit(Nt.EVENT_TYPES.LEAVE_LOBBY);
    this.server.in(leaveLobbyPayload.lobbyId).socketsLeave(leaveLobbyPayload.lobbyId);
  }


  @SubscribeMessage(Nt.EVENT_TYPES.CHANGE_TIMER)
  handleChangeTimer(
    @MessageBody() changeTimerPayload: Nt.eIChangeTimerEvent,
    @ConnectedSocket() client: Socket,
  ) {
    if(!this.gameService.isHost(changeTimerPayload.lobbyId, client['user'].user.idJoueur)){
      console.log("Not host");
      return;
    }
    const lobby = this.gameService.changeTimer(changeTimerPayload.lobbyId, changeTimerPayload.timer);
    if(!lobby){
      console.log("Lobby not found");
      return;
    }
    this.server.to(lobby.id).emit(Nt.EVENT_TYPES.UPDATE_LOBBY, lobby);
  }
  
  @SubscribeMessage(Nt.EVENT_TYPES.LOBBY_PLAYER_READY)
  handleLobbyPlayerReady(
    @MessageBody() lobbyPlayerReadyPayload: Nt.eILobbyPlayerReadyEvent,
    @ConnectedSocket() client: Socket,
  ) {
    const lobby = this.gameService.lobbyPlayerReady(lobbyPlayerReadyPayload.lobbyId, client['user'].user.idJoueur);
    if(!lobby){
      console.log("Lobby not found");
      return;
    }
    this.server.to(lobby.id).emit(Nt.EVENT_TYPES.UPDATE_LOBBY, lobby);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.LOBBY_PLAYER_UNREADY)
  handleLobbyPlayerUnready(
    @MessageBody() lobbyPlayerUnreadyPayload: Nt.eILobbyPlayerReadyEvent,
    @ConnectedSocket() client: Socket,
  ) {
    const lobby = this.gameService.lobbyPlayerUnready(lobbyPlayerUnreadyPayload.lobbyId, client['user'].user.idJoueur);
    if(!lobby){
      console.log("Lobby not found");
      return;
    }
    this.server.to(lobby.id).emit(Nt.EVENT_TYPES.UPDATE_LOBBY, lobby);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.LOBBY_START_GAME)
  async handleStartGame(
    @MessageBody() startGamePayload: Nt.eILobbyPlayerReadyEvent,
    @ConnectedSocket() client: Socket,
  ) {
    if(!this.gameService.isHost(startGamePayload.lobbyId, client['user'].user.idJoueur)){
      console.log("Not host");
      return;
    }
    const socketsInRoom = await this.server.in(startGamePayload.lobbyId).fetchSockets();
    const sockId2 = socketsInRoom.find((socket) => socket.id !== client.id).id;
    const game = this.gameService.startGame(startGamePayload.lobbyId, client.id, sockId2);
    if(!game){
      console.log("Unable to start game");
      return;
    }
    this.server.to(startGamePayload.lobbyId).emit(Nt.EVENT_TYPES.INCOMING_CATCH, game);
    this.sockets.find((socket) => socket.id === client.id).leave(startGamePayload.lobbyId);
    this.sockets.find((socket) => socket.id === sockId2).leave(startGamePayload.lobbyId);

  }




  

  
}
