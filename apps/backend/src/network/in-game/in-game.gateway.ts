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
import axios from 'axios';

async function saveRencontre(rencontre) {
  const response = await axios.post(
    'http://localhost:10001/rencontre-coups/rencontre',
    rencontre,
  );
  return response.data;
}

async function saveCoup(coup) {
  const response = await axios.post(
    'http://localhost:10001/rencontre-coups/coup',
    coup,
  );
  return response.data;
}

async function savePartie(rencontre, coups) {
  try {
    const savedRencontre = await saveRencontre(rencontre);

    for (const coup of coups) {
      coup.idRencontre = savedRencontre;
      await saveCoup(coup);
    }

    console.log('Partie sauvegardée avec succès');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la partie', error);
  }
}

export enum Echiquier {
  a1 = 11,
  a2 = 12,
  a3 = 13,
  a4 = 14,
  a5 = 15,
  a6 = 16,
  a7 = 17,
  a8 = 18,
  b1 = 21,
  b2 = 22,
  b3 = 23,
  b4 = 24,
  b5 = 25,
  b6 = 26,
  b7 = 27,
  b8 = 28,
  c1 = 31,
  c2 = 32,
  c3 = 33,
  c4 = 34,
  c5 = 35,
  c6 = 36,
  c7 = 37,
  c8 = 38,
  D1 = 41,
  D2 = 42,
  D3 = 43,
  D4 = 44,
  D5 = 45,
  D6 = 46,
  D7 = 47,
  D8 = 48,
  E1 = 51,
  E2 = 52,
  E3 = 53,
  e4 = 54,
  E5 = 55,
  E6 = 56,
  E7 = 57,
  E8 = 58,
  F1 = 61,
  F2 = 62,
  F3 = 63,
  F4 = 64,
  F5 = 65,
  F6 = 66,
  F7 = 67,
  F8 = 68,
  G1 = 71,
  G2 = 72,
  G3 = 73,
  G4 = 74,
  G5 = 75,
  G6 = 76,
  G7 = 77,
  G8 = 78,
  H1 = 81,
  H2 = 82,
  H3 = 83,
  H4 = 84,
  H5 = 85,
  H6 = 86,
  H7 = 87,
  H8 = 88,
}

function positionToNumber(position: string): number | null {
  const match = position.match(/^([a-hA-H])([1-8])$/);
  if (!match) {
    return null;
  }
  const [_, letter, number] = match;
  const letterCode = letter.toUpperCase().charCodeAt(0);
  const numberCode = parseInt(number, 10);
  return Echiquier[`${letter.toUpperCase()}${numberCode}`];
}

function formate_piece(piecename: string) {
  if (piecename === 'Pawn') return 'PION';
  if (piecename === 'Rook') return 'TOUR';
  if (piecename === 'Knight') return 'CAVALIER';
  if (piecename === 'Bishop') return 'FOU';
  if (piecename === 'Queen') return 'DAME';
  if (piecename === 'King') return 'ROI';
}

function formate_color(color: number) {
  if (color === 0) return 'BLANC';
  if (color === 1) return 'NOIR';
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
  private timersMap = new Map<string, Nt.CTimer>();
  private playerNames: Map<
    string,
    { joueurBlanc: string; joueurNoir: string }
  > = new Map();

  private delayMap = new Map<string, Nt.DelayTimer>();
  private timeoutMap = new Map<string, Nt.DelayTimer>();

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
    const games = this.matchMakingService.queue.gamesList;
    const actualPlayerId = client.id;
    const game1 = games.find(
      (game) => game.black_player.socketId === actualPlayerId,
    );
    const game2 = games.find(
      (game) => game.white_player.socketId === actualPlayerId,
    );
    const target: Nt.IGame = game1 || game2;
    // console.log(target);
    if (target) {
      console.log('game affected: ' + target.matchId);
      const matchId = target.matchId;
      if (this.matchMakingService.queue.matchStartedMap.has(matchId)) {
        console.log('match going pending');
        this.matchMakingService.queue.setInPendingMap(matchId, target);
        this.matchMakingService.queue.removeFromStartedMap(matchId);
        const timer30s: Nt.DelayTimer = new Nt.DelayTimer(() => {
          console.log('10s passed');
          console.log('No Reconnection' + matchId);
          this.matchMakingService.queue.removeFromStartedMap(matchId);
          this.server.to(matchId).emit(Nt.EVENT_TYPES.TIME_OUT, 'BLANC');
        }, 5000);
        timer30s.start();
        this.timeoutMap.set(matchId, timer30s);
      } else if (this.matchMakingService.queue.matchPendingMap.has(matchId)) {
        console.log('match already pending --> game ended NULL');
        this.matchMakingService.queue.removeFromPendingMap(matchId);
        this.matchMakingService.queue.destroyGame(matchId);
        this.delayMap.get(matchId)?.stop();
        this.timeoutMap.get(matchId)?.stop();
        this.delayMap.delete(matchId);
        this.timeoutMap.delete(matchId);
      } else {
        console.log('match not started --> wait 30second normally');
      }

      // console.log('matchId: ' + matchId);
      // console.log(this.timersMap);
      const toClearId = this.timersMap.get(matchId);
      if (toClearId) toClearId.stopTimer();
      // this.matchMakingService.queue.removeGame(matchId);
      // this.server.to(matchId).emit(Nt.EVENT_TYPES.GAME_OVER, {
      //   winner: target.winner,
      // });
    }

    // this.sockets = this.sockets.filter((socket) => socket.id !== client.id);
    // const games = this.matchMakingService.queue.gamesList;
    // const game = games.find((game) => game.socketIdWhite === client.id || game.socketIdBlack === client.id);
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

    if (game.white_player.socketId == client.id) {
      console.log('white player : ' + payload.name);
      //je set en Pending
      this.matchMakingService.queue.setInStartedMap(game.matchId, game);
      const timer30s: Nt.DelayTimer = new Nt.DelayTimer(() => {
        console.log('30s passed');
        console.log('this pending game will be destroyed' + game.matchId);
        this.matchMakingService.queue.removeFromStartedMap(game.matchId);
        this.server.to(game.matchId).emit(Nt.EVENT_TYPES.TIME_OUT, 'BLANC');
      }, 30000);
      timer30s.start();
      this.delayMap.set(game.matchId, timer30s);
    }
    client.join(game.matchId);
    const timer: Nt.CTimer = new Nt.CTimer(
      game.matchOptions,
      game.matchId,
      this.server,
    );
    this.timersMap.set(game.matchId, timer);

    // Stocker les noms des joueurs
    const currentPlayerNames = this.playerNames.get(payload.matchId) || {
      joueurBlanc: '',
      joueurNoir: '',
    };

    if (!currentPlayerNames.joueurBlanc) {
      currentPlayerNames.joueurBlanc = payload.name;
    } else if (!currentPlayerNames.joueurNoir) {
      currentPlayerNames.joueurNoir = payload.name;
    }

    this.playerNames.set(payload.matchId, currentPlayerNames);
  }

  @SubscribeMessage(Nt.EVENT_TYPES.FIRST_MOVE)
  handleFirstMove(
    @MessageBody() firstMovePayload: Nt.eIFirstMoveEvent,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('match-making: First move : ' + client.id);
    const { game } = firstMovePayload;
    if (this.delayMap.has(game.matchId)) {
      console.log('clearing delay');
      const timer = this.delayMap.get(game.matchId);
      timer.stop();
      this.delayMap.delete(game.matchId);
    }
    this.matchMakingService.queue.setInStartedMap(game.matchId, game);
    this.matchMakingService.queue.removeFromPendingMap(game.matchId);
    const timer = this.timersMap.get(game.matchId);
    timer.startTimer();
  }

  @SubscribeMessage(Nt.EVENT_TYPES.MAKE_MOVE)
  handleMove(
    @MessageBody() movePayload: Nt.eIMakeMoveEvent,
    @ConnectedSocket() client: Socket,
  ) {
    const { matchId, from, to } = movePayload;
    const coupledGames = this.matchMakingService.queue.coupledGamesMap;
    console.log(coupledGames);
    if (!coupledGames.has(matchId)) {
      console.log('error: game not found MAKE_MOVE');
      return;
    }
    const game = coupledGames.get(matchId);
    let gameResult = null;
    try {
      gameResult = game.makeMove(from, to);
    } catch (error) {
      console.log('error: invalid move !!');
      console.log(error);
      return;
    }

    console.log('move: ' + from + ' to ' + to);
    console.log('valid');
    if (gameResult) {
      // Récupérer les noms des joueurs
      const names = this.playerNames.get(matchId);

      // Sauvegarder la partie
      const rencontre = {
        pseudoJoueurBlanc: names.joueurBlanc,
        pseudoJoueurNoir: names.joueurNoir,
        vainqueur: gameResult.winner,
      };

      const coups = game.getMovesHistory().map((move) => ({
        idRencontre: null, // Cette valeur sera remplacée par l'ID de la rencontre sauvegardée
        caseSource: positionToNumber(move.from),
        caseDestination: positionToNumber(move.to),
        piece: formate_piece(move.piece),
        couleur: formate_color(move.color),
      }));

      try {
        savePartie(rencontre, coups);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la partie', error);
      }

      this.matchMakingService.queue.destroyGame(matchId);
      // this.timersMap.delete(matchId);
    }
    const timer = this.timersMap.get(matchId);
    const newId = timer.continueTimer();
    this.timers.set(matchId, newId);

    this.server.to(matchId).emit(Nt.EVENT_TYPES.MOVES, from, to, gameResult);
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
}
