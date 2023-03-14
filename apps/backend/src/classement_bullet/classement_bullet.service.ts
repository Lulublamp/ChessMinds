import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassementBlitz } from 'src/classement_blitz/entities/classementBlitz.entity';
import { Repository } from 'typeorm';
import { ClassementBulletDto } from './DTO/classementBullet.dto';

@Injectable()
export class ClassementBulletService {
 
  updateClassement(idJoeur: number, classementBullet: ClassementBulletDto) {
    throw new Error('Method not implemented.');
  }
  
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



