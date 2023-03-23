import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassementDto } from './DTO/classement.dto';
import { Classement } from './entities/classement.entity';

@Injectable()
export class ClassementService {
  updateClassement(idJoueur: number, classement: ClassementDto) {
    throw new Error('Method not implemented.');
  }
  /*updateClassement(idJoueur: number, classement: ClassementDto) {
    throw new Error('Method not implemented.');
  }*/
  constructor(
    @InjectRepository(Classement)
    private readonly classementRepository: Repository<Classement>,
  ) {}

  async findClassement(mode: 'asc' | 'desc'): Promise<Classement[]> {
    return await this.classementRepository.find(
      {order: {ELO: mode}},
    );
  }
/*
  //modifier le classement
  updateClassement(idJoueur:number,ELO: ClassementDto) {
    const classementUpdate = this.classementRepository.update(idJoueur, ELO);
    return classementUpdate;
  }*/
}
