import { Test, TestingModule } from '@nestjs/testing';
import { MmRankedGateway } from './mm-ranked.gateway';

describe('MmRankedGateway', () => {
  let gateway: MmRankedGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MmRankedGateway],
    }).compile();

    gateway = module.get<MmRankedGateway>(MmRankedGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
