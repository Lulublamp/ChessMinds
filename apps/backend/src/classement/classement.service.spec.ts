import { Test, TestingModule } from '@nestjs/testing';
import { ClassementService } from './classement.service';

describe('ClassementService', () => {
  let service: ClassementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassementService],
    }).compile();

    service = module.get<ClassementService>(ClassementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
