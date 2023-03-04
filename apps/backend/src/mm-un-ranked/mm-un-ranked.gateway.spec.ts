import { Test, TestingModule } from '@nestjs/testing';
import { MmUnRankedGateway } from './mm-un-ranked.gateway';

describe('MmUnRankedGateway', () => {
  let gateway: MmUnRankedGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MmUnRankedGateway],
    }).compile();

    gateway = module.get<MmUnRankedGateway>(MmUnRankedGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
