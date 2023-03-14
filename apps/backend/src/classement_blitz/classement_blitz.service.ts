import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassementBlitzDto } from './DTO/classementBlitz.dto';
import { ClassementBlitz } from './entities/classementBlitz.entity';

@Injectable()
export class ClassementBlitzService {
  updateClassement(idJoeur: number, classementBlitz: ClassementBlitzDto) {
    throw new Error('Method not implemented.');
  }
  /*updateClassement(idJoeur: number, classement: ClassementDto) {
    throw new Error('Method not implemented.');
  }*/
  constructor(
    @InjectRepository(ClassementBlitz)
    private readonly classementBlitzRepository: Repository<ClassementBlitz>,
  ) {}

  async findClassement(mode: 'asc' | 'desc'): Promise<ClassementBlitz[]> {
    return await this.classementBlitzRepository.find(
      {order: {ELO: mode}},
    );
  }






  }