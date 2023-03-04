import { Test, TestingModule } from '@nestjs/testing';
import { InitGameGateway } from './init-game.gateway';

describe('InitGameGateway', () => {
  let gateway: InitGameGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitGameGateway],
    }).compile();

    gateway = module.get<InitGameGateway>(InitGameGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
