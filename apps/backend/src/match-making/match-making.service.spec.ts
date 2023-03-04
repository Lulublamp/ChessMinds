import { Test, TestingModule } from '@nestjs/testing';
import { MatchMakingService } from './match-making.service';

describe('MatchMakingService', () => {
  let service: MatchMakingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchMakingService],
    }).compile();

    service = module.get<MatchMakingService>(MatchMakingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
