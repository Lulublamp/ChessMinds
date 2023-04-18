import { Test, TestingModule } from '@nestjs/testing';
import { CoupsService } from './coups.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Coups } from './entities/coups.entity';

describe('CoupsService', () => {
  let service: CoupsService;
  const mockCoupsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoupsService,
        {
          provide: getRepositoryToken(Coups),
          useValue: mockCoupsRepository,
        },
      ],
    }).compile();

    service = module.get<CoupsService>(CoupsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
