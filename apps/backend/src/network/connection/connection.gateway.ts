import { Nt } from '@TRPI/core';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MatchMakingService } from '../match-making/match-making.service';
import { ConnectionService } from './connection.service';
import { IMMPlayer } from '@TRPI/core/core-network';

@WebSocketGateway({
  namespace: Nt.NAMESPACE_TYPES.CONNECTION,
  cors: true,
})
export class ConnectionGateway {
  @WebSocketServer()
  server: any;

  private socketsMap: Map<number, Socket> = new Map();

  private lastInviteMap: Map<number, number> = new Map();

  constructor(
    private connectionService: ConnectionService,
    private matchMakingService: MatchMakingService,
  ) { }

  handleConnection(client: Socket) {
    console.log('New Global Connection : ' + client['user'].user.pseudo);
    this.socketsMap.set(client['user'].user.idJoueur, client);
    console.log('Checking invitations...');
    this.handleGetInvitations(client);
  }

  handleDisconnect(client: Socket) {
    console.log('Global Disconnect : ' + client['user'].user.pseudo);
    this.socketsMap.delete(client['user'].user.idJoueur);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.INVITE_FRIEND)
  handleInviteFriend(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: Nt.eIInviteFriend,
  ) {
    const { idInvite } = payload;
    const socket = this.socketsMap.get(idInvite);
    const res = this.connectionService.addInvitation(
      client['user'].user.idJoueur,
      idInvite,
    );
    if (!res) {
      console.log('Invitation already sent');
      return;
    }
    if (!socket) {
      console.log('Socket not found : Queueing the invitation');
    } else {
      console.log('Socket found : Sending the invitation right now');
      this.server.to(socket.id).emit(Nt.EVENT_TYPES.INVITATION_RECEIVED, {
        idInviter: client['user'].user.idJoueur,
      });
    }
  }

  @SubscribeMessage(Nt.EVENT_TYPES.GET_INVITATIONS)
  handleGetInvitations(@ConnectedSocket() client: Socket) {
    const invitations = this.connectionService.getInvitations(
      client['user'].user.idJoueur,
    );
    this.server
      .to(client.id)
      .emit(Nt.EVENT_TYPES.INVITATIONS_STATUS, invitations);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.PROCESS_INVITATION)
  handleProcessInvitation(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: Nt.eIInviteFriend,
  ) {
    this.connectionService.removeInvitation(
      client['user'].user.idJoueur,
      payload.idInvite,
    );
    this.handleGetInvitations(client);
  }


  @SubscribeMessage(Nt.EVENT_TYPES.CREATE_LOBBY)
  handleCreateLobby(@ConnectedSocket() client: Socket){
    const { user } = client['user'];

    

    const player: IMMPlayer = this.matchMakingService.mapPlayer(
      user,
      MatchMakingService.getDefaultOptions(),
    );

    const lobbyId = this.matchMakingService.createLobby(user, client.id);
  }


  @SubscribeMessage(Nt.EVENT_TYPES.JOIN_LOBBY)
  handleJoinLobby(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: Nt.eIJoinLobby
  ) {

    const { user } = client['user'];
    const { lobbyId } = payload;

    const player: IMMPlayer = this.matchMakingService.mapPlayer(
      user,
      MatchMakingService.getDefaultOptions(),
    );

    const maybeLobby = this.matchMakingService.joinLobby(lobbyId, player);

    if (maybeLobby == null) {
      this.server.to(client.id).emit(Nt.EVENT_TYPES.LOBBY_NOT_FOUND);
      return;
    }

    this.server
      .to([lobbyId.split('-')[0], client.id])
      .emit(Nt.EVENT_TYPES.LOBBY_STATUS, maybeLobby);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.PG_INVITATION)
  handlePGInvitation(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: Nt.eIPGInvitation,
  ) {
    const { idInvite } = payload;
    const { user } = client['user'];

    const socket = this.socketsMap.get(idInvite);

    if (socket == null) {
      console.log('Socket not found : No invitation sent');
      return;
    }

    const lastInviter = this.lastInviteMap.get(user.idJoueur);
    const canInvite = lastInviter == null || lastInviter != idInvite;

    if (!canInvite) {
      return;
    }

    this.lastInviteMap.set(user.idJoueur, idInvite);
    this.server.to(socket).emit(Nt.EVENT_TYPES.RECEIVE_PG_INVITATION, {
      idJoueur: user.idJoueur,
      pseudo: user.pseudo,
    });
  }

  @SubscribeMessage(Nt.EVENT_TYPES.PROCESS_PG_INVITATION)
  handleProcessPGInvitation(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: Nt.eIPGProcess,
  ) {
    const { idInviter, accept, lobbyId } = payload;
    const { user } = client['user'];

    const socketInviter = this.socketsMap.get(idInviter)

    if (socketInviter == null) {
      console.log('Socket not found : Inviter disconnected');
      return;
    }

    this.lastInviteMap.delete(user.idJoueur);
    if (accept) {
      this.handleJoinLobby(client, { lobbyId });
    }
  }
}
