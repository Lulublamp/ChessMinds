import { Test, TestingModule } from '@nestjs/testing';
import { JoueursService } from './joueurs.service';

describe('JoueursService', () => {
  let service: JoueursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JoueursService],
    }).compile();

    service = module.get<JoueursService>(JoueursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
