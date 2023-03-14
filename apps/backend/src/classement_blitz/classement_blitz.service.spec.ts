import { Test, TestingModule } from '@nestjs/testing';
import { ClassementBlitzService } from './classement_blitz.service';

describe('ClassementBlitzService', () => {
  let service: ClassementBlitzService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassementBlitzService],
    }).compile();

    service = module.get<ClassementBlitzService>(ClassementBlitzService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
