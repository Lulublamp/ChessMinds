import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassementNotFound, PlayerNotFound, TypeNotFound } from 'src/errors/bErrors';
import { Repository } from 'typeorm';
import { ClassementDto } from './DTO/classement.dto';
import { Classement, TypePartie } from './entities/classement.entity';

@Injectable()
export class ClassementService {

  constructor(
    @InjectRepository(Classement)
    private readonly classementRepository: Repository<Classement>,
  ) {}

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

  //recupere le classement d'un joueur avec son id 
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

  //Recupere le classement selon le type de partie et le trie par ELO
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
        throw new TypeNotFound();
    }
    return await this.classementRepository.find({
      order: {
        [column]: 'DESC',
      },
      //relations: ['idJoueur'],
    });
  }
 

  async updateELO(idClassement: Pick<Classement, 'idClassement'>, typePartie: TypePartie, elo: number): Promise<Classement> {
    const classement = await this.classementRepository.findOneBy(idClassement);
    if(!classement){
      throw new ClassementNotFound()
    }
    classement[typePartie] = elo;
    return await this.classementRepository.save(classement);
  }
}
 
 

  


