import { MMPlayer } from "../src/interfaces/emitEvents";
import { Queue } from "../src/utils/Queue";
import { Socket } from "socket.io";
import { MATCHMAKING_MODE, MATCHMAKING_MODES_TIMERS } from "../src/Namespace";

function rankPlayers(player: MMPlayer): number | null {
  if (player.elo < 800) {
    return 1;
  } else if (player.elo < 1000) {
    return 2;
  } else if (player.elo < 1200) {
    return 3;
  } else if (player.elo < 1400) {
    return 4;
  } else if (player.elo < 1600) {
    return 5;
  } else if (player.elo < 1800) {
    return 6;
  } else if (player.elo < 2000) {
    return 7;
  }
  return null;
}

function playerMocker(name: string , elo: number , mode: MATCHMAKING_MODE , timer: MATCHMAKING_MODES_TIMERS): MMPlayer {  
  const id = Math.random().toString(36).substring(7);
  const options = {mode,timer}

  const player: MMPlayer = {
    id,
    elo,
    name,
    socketId: name,
    options
  }
  player.rank = rankPlayers(player);
  return player;
}

describe('Queue', () => {

  let queue: Queue;
  
  
  beforeAll(() => {
  });
  
  beforeEach(() => {
    queue = new Queue(100);
  });

  it('S\'initialise', () => {
    expect(queue).toBeDefined();
  });

  describe('isReadyToMatch', () => {
    it('Retourne faux si la queue est vide', () => {
      const playerMock: MMPlayer = playerMocker('NameMock', 800, 'ranked', 'blitz');
      const [isReady, opponent] = queue.isReadyToMatch(playerMock, playerMock.options!);
      expect(isReady).toBeFalsy();
      expect(opponent).toBeNull();
    });

    it('Retourne vrai si la queue contient un joueur même rang même options', () => {
      const playerMock: MMPlayer = playerMocker('NameMock', 800, 'ranked', 'blitz');
      const playerMock2: MMPlayer = playerMocker('NameMock2', 800, 'ranked', 'blitz');
      queue.addPlayerToQueue(playerMock, playerMock.socketId!, playerMock.options!);
      const [isReady, opponent] = queue.isReadyToMatch(playerMock2, playerMock2.options!);
      expect(isReady).toBeTruthy();
      expect(opponent).toBeDefined();
    });

    it('Retourne faux si la queue contient un joueur même rang, options différentes ', () => {
      const playerMock: MMPlayer = playerMocker('NameMock', 800, 'ranked', 'blitz');
      const playerMock2: MMPlayer = playerMocker('NameMock2', 800, 'unranked', 'blitz');
      const playerMock3: MMPlayer = playerMocker('NameMock3', 800, 'ranked', 'rapid');
      const playerMock4: MMPlayer = playerMocker('NameMock4', 800, 'unranked', 'rapid');

      queue.addPlayerToQueue(playerMock2, playerMock2.socketId!, playerMock2.options!);
      queue.addPlayerToQueue(playerMock3, playerMock3.socketId!, playerMock3.options!);
      queue.addPlayerToQueue(playerMock4, playerMock4.socketId!, playerMock4.options!);
      const [isReady, opponent] = queue.isReadyToMatch(playerMock, playerMock.options!);
      expect(isReady).toBeFalsy()
      expect(opponent).toBeNull();
    });

    it('Retourne faux si la queue contient un joueur rang différent, même options', () => {
      const playerMock: MMPlayer = playerMocker('NameMock', 800, 'ranked', 'blitz');
      const playerMock2: MMPlayer = playerMocker('NameMock2', 1100, 'ranked', 'blitz');
      queue.addPlayerToQueue(playerMock2, playerMock2.socketId!, playerMock2.options!);
      const [isReady, opponent] = queue.isReadyToMatch(playerMock, playerMock.options!);
      expect(isReady).toBeFalsy()
      expect(opponent).toBeNull();
    });
  });

  describe('addPlayerToQueue', () => {

    it('Ajoute un joueur à la queue', () => {
      const playerMock: MMPlayer = playerMocker('NameMock', 800, 'ranked', 'blitz');
      const result = queue.addPlayerToQueue(playerMock, playerMock.socketId!, playerMock.options!);
      expect(result).toBe(-2);
      expect(queue.queueList.length).toBe(1);
    });

    it('Retourne -1 si la queue est pleine', () => {
      const playerMock: MMPlayer = playerMocker('NameMock', 800, 'ranked', 'blitz');
      for (let i = 0; i < 100; i++) {
        queue.queueList.push(playerMock);
      }
      const result = queue.addPlayerToQueue(playerMock, playerMock.socketId!, playerMock.options!);
      expect(result).toBe(-1);
      expect(queue.queueList.length).toBe(100);
    });

    it('Retourne un objet IGame si le joueur est prêt à matcher', () => {
      const playerMock: MMPlayer = playerMocker('NameMock', 800, 'ranked', 'blitz');
      const playerMock2: MMPlayer = playerMocker('NameMock2', 800, 'ranked', 'blitz');
      queue.addPlayerToQueue(playerMock2, playerMock2.socketId!, playerMock2.options!);
      const result = queue.addPlayerToQueue(playerMock, playerMock.socketId!, playerMock.options!);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('matchId');
      expect(result).toHaveProperty('white_player');
      expect(result).toHaveProperty('black_player');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('matchOptions');
      expect(result).toHaveProperty('winnder');
      expect(queue.queueList.length).toBe(0);
    });
  });
});