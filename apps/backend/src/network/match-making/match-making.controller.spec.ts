import { Test, TestingModule } from '@nestjs/testing';
import { MatchMakingController } from './match-making.controller';

describe('MatchMakingController', () => {
  let controller: MatchMakingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchMakingController],
    }).compile();

    controller = module.get<MatchMakingController>(MatchMakingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
