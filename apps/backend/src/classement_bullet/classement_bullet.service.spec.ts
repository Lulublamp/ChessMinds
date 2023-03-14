import { Test, TestingModule } from '@nestjs/testing';
import { ClassementBulletService } from './classement_bullet.service';

describe('ClassementBulletService', () => {
  let service: ClassementBulletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassementBulletService],
    }).compile();

    service = module.get<ClassementBulletService>(ClassementBulletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
