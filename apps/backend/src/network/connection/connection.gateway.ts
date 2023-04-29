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

@WebSocketGateway({
  namespace: Nt.NAMESPACE_TYPES.CONNECTION,
  cors: true,
})
export class ConnectionGateway {
  @WebSocketServer()
  server: any;

  private socketsMap: Map<number, Socket> = new Map();

  constructor(
    private connectionService: ConnectionService,
    private matchMakingService: MatchMakingService,
  ) {}

  handleConnection(client: Socket) {
    console.log('New Global Connection : ' + client['user'].user.pseudo);
    this.socketsMap.set(client['user'].user.idJoueur, client);
    console.log('Checking invitations...');
    const invitations = this.connectionService.checkForInvitations(
      client['user'].user.idJoueur,
    );
    console.log(invitations);
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
    }
  }
}
