import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coups } from './entities/coups.entity';
import { CreateCoupDto } from './DTO/coups.dto';

@Injectable()
export class CoupsService {
  constructor(
    @InjectRepository(Coups)
    private coupsRepository: Repository<Coups>,
  ) {}

}
