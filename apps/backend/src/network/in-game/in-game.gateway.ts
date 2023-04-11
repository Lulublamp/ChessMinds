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
import { IGame } from '@TRPI/core/core-network';
import { JoinQueuOption } from '@TRPI/core/core-network/src/MatchMaking';

export class CTimer {
  public blackTime;
  public whiteTime;
  private server;
  private turn = 0;
  private id: NodeJS.Timer = undefined;
  private time: number;
  constructor(
    public options: JoinQueuOption,
    public matchId: string,
    server: Server,
  ) {
    switch (options.timer) {
      case Nt.MATCHMAKING_MODES_TIMERS.BULLET:
        this.time = 1 * 60;
        break;
      case Nt.MATCHMAKING_MODES_TIMERS.BLITZ:
        this.time = 3 * 60;
        break;
      case Nt.MATCHMAKING_MODES_TIMERS.RAPID:
        this.time = 5 * 60;
        break;
      default:
        this.time = 1 * 60;
        break;
    }
    this.matchId = matchId;
    this.blackTime = this.time;
    this.whiteTime = this.time;
    this.server = server;
  }

  public startTimer() {
    this.turn = 0;
  }

  public stopTimer() {
    clearInterval(this.id);
  }

  public continueTimer() {
    if (this.id !== undefined) {
      clearInterval(this.id);
    }
    let ifTimer = false;
    let timer: NodeJS.Timer;
    if (this.turn === 0 && this.blackTime > 0) {
      timer = setInterval(() => {
        this.blackTime -= 1;
        this.sendData(this.server, this.matchId);
        console.log('white time: ' + this.blackTime);
        if (this.blackTime <= 0) {
          clearInterval(timer);
          this.server.to(this.matchId).emit(Nt.EVENT_TYPES.NO_TIME, 'black');
          this.blackTime = 0;
        }
        if (this.whiteTime <= 0) {
          clearInterval(timer);
          this.server.to(this.matchId).emit(Nt.EVENT_TYPES.NO_TIME, 'white');
          this.whiteTime = 0;
        }
      }, 1000);
      ifTimer = true;
    } else if (this.turn === 1 && this.whiteTime > 0) {
      timer = setInterval(() => {
        this.whiteTime -= 1;
        this.sendData(this.server, this.matchId);
        console.log('black time: ' + this.whiteTime);
        if (this.whiteTime <= 0) {
          clearInterval(timer);
          this.server.to(this.matchId).emit(Nt.EVENT_TYPES.NO_TIME, 'white');
          this.whiteTime = 0;
        }
        if (this.blackTime <= 0) {
          clearInterval(timer);
          this.server.to(this.matchId).emit(Nt.EVENT_TYPES.NO_TIME, 'black');
          this.blackTime = 0;
        }
      }, 1000);
      ifTimer = true;
    }
    this.turn = this.turn === 0 ? 1 : 0;
    this.id = timer;
    if (!ifTimer) console.log('no timer finito');
    return timer;
  }

  public getData() {
    return {
      whiteTime: this.blackTime,
      blackTime: this.whiteTime,
    };
  }

  public sendData(server: Server, matchId: string) {
    server.to(matchId).emit(Nt.EVENT_TYPES.TIMER, this.getData());
  }
}

@WebSocketGateway({
  namespace: Nt.NAMESPACE_TYPES.IN_GAME,
  cors: true,
})
export class InGameGateway {
  @WebSocketServer()
  server: Server;

  private sockets: Socket[] = [];
  private chatService: Nt.ChatService = new Nt.ChatService();
  private timers = new Map<string, NodeJS.Timer>();
  private timersMap = new Map<string, CTimer>();

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
    // this.sockets = this.sockets.filter((socket) => socket.id !== client.id);
    const games = this.matchMakingService.queue.gamesList;
    const game1 = games.find(
      (game) => game.black_player.socketId === client.id,
    );
    const game2 = games.find(
      (game) => game.white_player.socketId === client.id,
    );
    const target: Nt.IGame = game1 || game2;
    console.log(target);
    if (target) {
      const matchId = target.matchId;
      console.log('matchId: ' + matchId);
      console.log(this.timersMap);
      const toClearId = this.timersMap.get(matchId);
      if (toClearId) toClearId.stopTimer();
      // this.matchMakingService.queue.removeGame(matchId);
      // this.server.to(matchId).emit(Nt.EVENT_TYPES.GAME_OVER, {
      //   winner: target.winner,
      // });
    }
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

  @SubscribeMessage(Nt.EVENT_TYPES.FIRST_MOVE)
  handleFirstMove(
    @MessageBody() firstMovePayload: Nt.eIFirstMoveEvent,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('match-making: First move : ' + client.id);
    const { matchId, options } = firstMovePayload;
    const timer: CTimer = new CTimer(options, matchId, this.server);
    const toClearId = timer.startTimer();
    this.timersMap.set(matchId, timer);
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
    const timer = this.timersMap.get(matchId);
    const newId = timer.continueTimer();
    this.timers.set(matchId, newId);

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

    this.chatService.addChatMessage(
      chatMessage.matchId,
      chatMessageWithTimestamp,
    );
    this.server
      .to(chatMessage.matchId)
      .emit(Nt.EVENT_TYPES.RECEIVE_CHAT_MESSAGE, chatMessageWithTimestamp);
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

  @SubscribeMessage(Nt.EVENT_TYPES.CANCEL_MOVE)
  handleCancelMove(
    @MessageBody() payload: { matchId: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('in-game: Cancel move');
    const games = this.matchMakingService.queue.gamesList;
    const game = games.find((game) => game.matchId === payload.matchId);
    if (!game) {
      console.log('error: game not found CANCEL_MOVE');
      return;
    }
    const timer = this.timersMap.get(payload.matchId);
    const newId = timer.continueTimer();
    this.timers.set(payload.matchId, newId);
    // Get the room's sockets
    const roomSockets = this.server.sockets.adapter.rooms.get(payload.matchId);

    if (!roomSockets) {
      console.log('error: room not found CANCEL_MOVE');
      return;
    }

    // Find the opponent's socket ID
    const opponentSocketId = [...roomSockets].find((socketId) => socketId !== client.id);

    // Emit the cancel move request only to the opponent
    if (opponentSocketId) {
      this.server.to(opponentSocketId).emit(Nt.EVENT_TYPES.CANCEL_MOVE_REQUEST);
    } else {
      console.log('error: opponent not found CANCEL_MOVE');
    }
    
  }

  @SubscribeMessage(Nt.EVENT_TYPES.CANCEL_MOVE_RESPONSE)
  handleCancelMoveResponse(
    @MessageBody() payload: { matchId: string, accepted: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('in-game: Cancel move response');
    const games = this.matchMakingService.queue.gamesList;
    const game = games.find((game) => game.matchId === payload.matchId);
    if (!game) {
      console.log('error: game not found CANCEL_MOVE_RESPONSE');
      return;
    }

    // Get the room's sockets
    const roomSockets = this.server.sockets.adapter.rooms.get(payload.matchId);

    if (!roomSockets) {
      console.log('error: room not found CANCEL_MOVE_RESPONSE');
      return;
    }

    // Find the requester's socket ID
    const requesterSocketId = [...roomSockets].find((socketId) => socketId !== client.id);

    if (requesterSocketId) {
      if (payload.accepted) {
        // Emit the cancel move response event to the requester with acceptance status
        this.server.to(requesterSocketId).emit(Nt.EVENT_TYPES.CANCEL_MOVE_RESPONSE, { accepted: true });
      } else {
        // Emit the cancel move response event to the requester with rejection status
        this.server.to(requesterSocketId).emit(Nt.EVENT_TYPES.CANCEL_MOVE_RESPONSE, { accepted: false });
      }
    } else {
      console.log('error: requester not found CANCEL_MOVE_RESPONSE');
    }
  }

  @SubscribeMessage(Nt.EVENT_TYPES.DRAW_REQUEST)
  handleDrawRequest(
    @MessageBody() payload: { matchId: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('in-game: Draw request');

    const roomSockets = this.server.sockets.adapter.rooms.get(payload.matchId);

    if (!roomSockets) {
      console.log('error: room not found DRAW_REQUEST');
      return;
    }

    const opponentSocketId = [...roomSockets].find((socketId) => socketId !== client.id);

    if (opponentSocketId) {
      this.server.to(opponentSocketId).emit(Nt.EVENT_TYPES.DRAW_REQUEST);
    } else {
      console.log('error: opponent not found DRAW_REQUEST');
    }
  }

  @SubscribeMessage(Nt.EVENT_TYPES.DRAW_RESPONSE)
  handleDrawResponse(
    @MessageBody() payload: { matchId: string, accepted: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('in-game: Draw response');

    const roomSockets = this.server.sockets.adapter.rooms.get(payload.matchId);

    if (!roomSockets) {
      console.log('error: room not found DRAW_RESPONSE');
      return;
    }

    const requesterSocketId = [...roomSockets].find((socketId) => socketId !== client.id);

    if (requesterSocketId) {
      if (payload.accepted) {
        this.server.to(requesterSocketId).emit(Nt.EVENT_TYPES.DRAW_RESPONSE, { accepted: true });
        // You can also handle the draw result here, e.g., update game state and inform both players.
      } else {
        this.server.to(requesterSocketId).emit(Nt.EVENT_TYPES.DRAW_RESPONSE, { accepted: false });
      }
    } else {
      console.log('error: requester not found DRAW_RESPONSE');
    }
  }




}
