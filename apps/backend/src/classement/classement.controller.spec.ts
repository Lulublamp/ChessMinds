import { Test, TestingModule } from '@nestjs/testing';
import { ClassementController } from './classement.controller';

describe('ClassementController', () => {
  let controller: ClassementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassementController],
    }).compile();

    controller = module.get<ClassementController>(ClassementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
