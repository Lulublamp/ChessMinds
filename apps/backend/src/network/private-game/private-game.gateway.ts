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
    console.log('Lobbies: Connection : ' + client.id);
    this.sockets.push(client);
    // Notify all friends that the player is online
    const playerFriends = await this.joueursService.getAmis(client['user'].user);
    const friendSockets = playerFriends.map((friend) => {
      const friendSocket = this.sockets.find((socket) => socket['user'].user.idJoueur === friend.idJoueur);
      if(friendSocket){
        console.log("Sending to " + friend.pseudo);
        this.server.to(friendSocket.id).emit(Nt.EVENT_TYPES.AMIS_ONLINE, client['user'].user.idJoueur);
      }
    });
    
  }

  async handleDisconnect(client: Socket) {
    console.log('Lobbies: Disconnect : ' + client.id);
    this.sockets = this.sockets.filter((socket) => socket.id !== client.id);
    // Notify all friends that the player is offline
    const playerFriends = await this.joueursService.getAmis(client['user'].user);
    const friendSockets = playerFriends.map((friend) => {
      const friendSocket = this.sockets.find((socket) => socket['user'].user.idJoueur === friend.idJoueur);
      if(friendSocket){
        this.server.to(friendSocket.id).emit(Nt.EVENT_TYPES.AMIS_OFFLINE, client['user'].user.idJoueur);
      }
    });
  }

  @SubscribeMessage('test')
  async handleTest(
    @MessageBody() testPayload: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Lobbies: Test');
    console.log(client['user']);
    console.log("Id");
    console.log(client['user'].user.idJoueur);
    // const playerFriends = await this.joueursService.getAmis(client['user']);
    // console.log("playerFriends : ");
    // console.log(playerFriends);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.GET_AMIS_WITH_STATUS)
  async handleGetAmisWithStatus(
    @ConnectedSocket() client: Socket,
  ) {
    console.log('request by ' + client['user'].user.pseudo);
    const playerFriends = await this.joueursService.getAmis(client['user'].user);
    console.log("playerFriends : ");
    console.log(playerFriends);
    const playerFriendsWithStatus = playerFriends.map((friend) => {
      const friendSocket = this.sockets.find((socket) => socket['user'].user.idJoueur === friend.idJoueur);
      return {
        ...friend,
        status: friendSocket ? 'online' : 'offline',
      };
    });
    console.log("playerFriendsWithStatus : ");
    console.log(playerFriendsWithStatus);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.INVITE_AMI)
  handleInviteAmis(
    @MessageBody() inviteAmisPayload: Nt.eIInviteAmisEvent,
    @ConnectedSocket() client: Socket,
  ) {
    const friendSocket = this.sockets.find((socket) => socket['user'].user.idJoueur === inviteAmisPayload.idJoueur);
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
    
    if(invitationResponsePayload.reponse === true){
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
  handleStartGame(
    @MessageBody() startGamePayload: Nt.eILobbyPlayerReadyEvent,
    @ConnectedSocket() client: Socket,
  ) {
    
  }




  

  
}
