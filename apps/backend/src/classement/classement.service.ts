import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassementDto } from './DTO/classement.dto';
import { Classement } from './entities/classement.entity';

@Injectable()
export class ClassementService {
  constructor(
    @InjectRepository(Classement)
    private readonly classementRepository: Repository<Classement>,
  ) {}

  //retrouver le classment
    //on utilise l'idJoeur pour retrouver le classement
    //en soit on cherche le classement d'un joueur
    //donc logique qu'on chereche avec l'id du joueur 
    //a demander avis a l'equipe
  async findClassement(idJoueur: number) {
    return await this.classementRepository.find();
  }

  //modifier le classement
  /*
  updateClassement(idJoueur:number,classement: ClassementDto) {
    const classementUpdate = this.classementRepository.update(idJoueur, classement);
    return classementUpdate;
  }*/

}
