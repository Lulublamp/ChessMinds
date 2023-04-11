import { Test, TestingModule } from '@nestjs/testing';
import { RencontreService } from './rencontre.service';

describe('RencontreService', () => {
  let service: RencontreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RencontreService],
    }).compile();

    service = module.get<RencontreService>(RencontreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
