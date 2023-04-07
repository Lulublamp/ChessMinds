import { Test, TestingModule } from '@nestjs/testing';
import { RencontreController } from './rencontre.controller';

describe('RencontreController', () => {
  let controller: RencontreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RencontreController],
    }).compile();

    controller = module.get<RencontreController>(RencontreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
