import { Test, TestingModule } from '@nestjs/testing';
import { CoupsController } from './coups.controller';
import { CoupsService } from './coups.service';

describe('CoupsController', () => {
  let controller: CoupsController;
  const mockCoupsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoupsController],
      providers: [
        {
          provide: CoupsService,
          useValue: mockCoupsService,
        },
      ],
    }).compile();

    controller = module.get<CoupsController>(CoupsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
