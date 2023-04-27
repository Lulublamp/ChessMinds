import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partie } from './entities/partie.entity';

@Injectable()
export class PartieService {
  constructor(
    @InjectRepository(Partie)
    private partieRepository: Repository<Partie>,
  ) {}

}
