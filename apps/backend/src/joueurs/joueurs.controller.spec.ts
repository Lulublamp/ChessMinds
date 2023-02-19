import { Test, TestingModule } from '@nestjs/testing';
import { JoueursController } from './joueurs.controller';
import { JoueursService } from './joueurs.service';

describe('JoueursController', () => {
  let controller: JoueursController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JoueursController],
      providers: [JoueursService],
    }).compile();

    controller = module.get<JoueursController>(JoueursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
