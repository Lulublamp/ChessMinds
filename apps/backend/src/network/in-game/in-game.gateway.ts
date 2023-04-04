import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Nt } from '@TRPI/core';
import { Socket, Server } from 'socket.io';
import { MatchMakingService } from '../match-making/match-making.service';

@WebSocketGateway({
  namespace: Nt.NAMESPACE_TYPES.IN_GAME,
  cors: true,
})
export class InGameGateway {
  @WebSocketServer()
  server: Server;

  private sockets: Socket[] = [];
  private chatService: Nt.ChatService = new Nt.ChatService();

  constructor(private matchMakingService: MatchMakingService) {}

  afterInit() {
    console.log('in-game: Init');
  }

  handleConnection(client: Socket) {
    console.log('in-game: Connection : ' + client.id);
    this.sockets.push(client);
  }

  handleDisconnect(client: Socket) {
    console.log('in-game: Disconnect : ' + client.id);
    this.sockets = this.sockets.filter((socket) => socket.id !== client.id);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.ATTACH)
  handleAttach(
    @MessageBody() payload: { matchId: string; name: string },
    @ConnectedSocket() client: Socket,
  ) {
    const games = this.matchMakingService.queue.gamesList;
    const game = games.find((game) => game.matchId === payload.matchId);
    if (!game) {
      console.log('error: game not found ATTACH');
      return;
    }
    this.matchMakingService.queue.mutateGameSocketId(
      game.matchId,
      client.id,
      payload.name,
    );
    client.join(game.matchId);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.MAKE_MOVE)
  handleMove(
    @MessageBody() movePayload: Nt.eIMakeMoveEvent,
    @ConnectedSocket() client: Socket,
  ) {
    const { matchId, from, to } = movePayload;
    const coupledGames = this.matchMakingService.queue.coupledGamesList;
    console.log(coupledGames);
    if (!coupledGames.has(matchId)) {
      console.log('error: game not found MAKE_MOVE');
      return;
    }
    const game = coupledGames.get(matchId);
    try {
      game.makeMove(from, to);
    } catch (error) {
      console.log('error: invalid move !!');
      console.log(error);
      return;
    }

    console.log('move: ' + from + ' to ' + to);
    console.log('valid');
    this.server.to(matchId).emit(Nt.EVENT_TYPES.MOVES, from, to);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.SEND_CHAT_MESSAGE)
  handleSendMessage(
    @MessageBody() chatMessage: Omit<Nt.ChatMessage, 'timestamp'>,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('in-game: Chat message received');

    const chatMessageWithTimestamp: Nt.ChatMessage = {
      ...chatMessage,
      timestamp: Date.now(),
    };

    this.chatService.addChatMessage(chatMessage.matchId, chatMessageWithTimestamp);
    this.server.to(chatMessage.matchId).emit(Nt.EVENT_TYPES.RECEIVE_CHAT_MESSAGE, chatMessageWithTimestamp);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.REQUEST_CHAT_HISTORY)
  handleRequestChatHistory(
    @MessageBody() payload: { matchId: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('in-game: Chat history request');
    const chatHistory = this.chatService.getChatHistory(payload.matchId);
    client.emit(Nt.EVENT_TYPES.SEND_CHAT_HISTORY, chatHistory);
  }
}
