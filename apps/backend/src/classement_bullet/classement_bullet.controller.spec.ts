import { Test, TestingModule } from '@nestjs/testing';
import { ClassementBulletController } from './classement_bullet.controller';

describe('ClassementBulletController', () => {
  let controller: ClassementBulletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassementBulletController],
    }).compile();

    controller = module.get<ClassementBulletController>(ClassementBulletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
