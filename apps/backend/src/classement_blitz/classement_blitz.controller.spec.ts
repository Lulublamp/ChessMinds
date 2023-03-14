import { Test, TestingModule } from '@nestjs/testing';
import { ClassementBlitzController } from './classement_blitz.controller';

describe('ClassementBlitzController', () => {
  let controller: ClassementBlitzController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassementBlitzController],
    }).compile();

    controller = module.get<ClassementBlitzController>(ClassementBlitzController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
