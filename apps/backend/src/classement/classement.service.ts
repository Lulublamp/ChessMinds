import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassementNotFound, PlayerNotFound } from 'src/errors/bErrors';
import { Repository } from 'typeorm';
import { ClassementDto } from './DTO/classement.dto';
import { Classement, TypePartie } from './entities/classement.entity';

@Injectable()
export class ClassementService {
  updateClassement(id: number, classement: ClassementDto) {
    throw new Error('Method not implemented.');
  }
 
  /*updateClassement(idJoueur: number, classement: ClassementDto) {
    throw new Error('Method not implemented.');
  }*/
  constructor(
    @InjectRepository(Classement)
    private readonly classementRepository: Repository<Classement>,
  ) {}

  async findByType(type: string): Promise<Classement[]> {
    let column: keyof Classement;
    switch (type) {
      case TypePartie.RAPIDE:
        column = 'ELORapide';
        break;
      case TypePartie.BULLET:
        column = 'ELOBullet';
        break;
      case TypePartie.BLITZ:
        column = 'ELOBlitz';
        break;
      default:
        throw new Error(`Type de partie inconnu: ${type}`);
    }
    return await this.classementRepository.find({
      order: {
        [column]: 'DESC',
      },
      //relations: ['idJoueur'],
    });
  }

  async findJoueur(idJoueur: Pick<ClassementDto, "idJoueur">): Promise<Classement> {
    const trouverJoueur= await this.classementRepository.findOne({
      where: {
        idJoueur: idJoueur,
      },
    });
    if(!trouverJoueur){
      throw new PlayerNotFound()
    }
    return trouverJoueur;
  }
  
  creerClassement(classement: ClassementDto) {
    throw new Error('Method not implemented.');
  }


  async findClassement(id: Pick<Classement, 'idClassement'>){
    const trouverClassement = await this.classementRepository.findOne({
      where: {
        idClassement:id.idClassement,
      },
    });
    if(!trouverClassement){
      throw new ClassementNotFound()
    }
    return trouverClassement;
  }
  
    async updateELO(idClassement: Pick<Classement, 'idClassement'>, typePartie: TypePartie, elo: number): Promise<Classement> {
    const classement = await this.classementRepository.findOneBy(idClassement);
    classement[typePartie] = elo;
    return await this.classementRepository.save(classement);
  }
}
 
 
  


