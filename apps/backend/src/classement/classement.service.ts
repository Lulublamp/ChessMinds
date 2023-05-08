import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassementNotFound, PlayerNotFound } from 'src/errors/bErrors';
import { Repository } from 'typeorm';
import { ClassementDto } from './DTO/classement.dto';
import { Classement, TypePartie } from './entities/classement.entity';
import { Joueur } from 'src/joueurs/entities/joueur.entity';
import { JoueurDto } from 'src/joueurs/DTO/joueurs.dto';

@Injectable()
export class ClassementService {
  constructor(
    @InjectRepository(Classement)
    private readonly classementRepository: Repository<Classement>,
  ) { }

  async creerClassement(classementDto: ClassementDto) {
    const newClassement = this.classementRepository.create(classementDto);
    await this.classementRepository.save(newClassement);
  }

  async getMyHighestElo(joueurDto: JoueurDto, typePartie: TypePartie): Promise<number> {
    const classement = await this.classementRepository.findOne({
      where: { user_id: { idJoueur: joueurDto.idJoueur } },
    });
    if (!classement) {
      throw new NotFoundException('Classement introuvable pour cet utilisateur');
    }
    return Promise.resolve(classement[typePartie]);
  }


  async getEloByUserId(joueurDto: JoueurDto): Promise<Partial<ClassementDto>> {
    const classement = await this.classementRepository.findOne({
      where: { user_id: { idJoueur: joueurDto.idJoueur } },
    });

    if (!classement) {
      throw new NotFoundException('Classement introuvable pour cet utilisateur');
    }

    return {
      elo_blitz: classement.elo_blitz,
      elo_bullet: classement.elo_bullet,
      elo_rapide: classement.elo_rapide,
    };
  }

  async getEloByUserIdAndTypePartie(joueurDto: JoueurDto, typePartie: TypePartie): Promise<number> {
    const classement = await this.classementRepository
      .createQueryBuilder('classement')
      .select(`classement.${typePartie}`)
      .where('classement.user_id = :userId', { userId: joueurDto.idJoueur })
      .getOne();

    if (!classement) {
      throw new NotFoundException('Classement introuvable pour cet utilisateur');
    }
    return classement[typePartie];
  }
  

  async getMyRank(joueurDto: JoueurDto, typePartie: TypePartie): Promise<number> {
    // Récupère l'ELO du joueur pour le type de partie donné
    const myElo = await this.getEloByUserIdAndTypePartie(joueurDto, typePartie);

    // Compte combien de joueurs ont un ELO plus élevé que le joueur donné pour le type de partie donné
    const higherRankedPlayersCount = await this.classementRepository
      .createQueryBuilder('classement')
      .where(`classement.${typePartie} > :myElo`, { myElo: myElo })
      .getCount();
    // La position du joueur dans le classement est le nombre de joueurs avec un ELO plus élevé plus un
    return higherRankedPlayersCount + 1;
  }



  async findTop20ByElo(typePartie: TypePartie): Promise<Classement[]> {
    return await this.classementRepository
      .createQueryBuilder('classement')
      .select([
        'classement.idClassement',
        'joueur.idJoueur',
        'joueur.pseudo',
        `classement.${typePartie}`,
      ])
      .leftJoinAndSelect('classement.user_id', 'joueur')
      .orderBy(`classement.${typePartie}`, 'DESC')
      .limit(20)
      .getMany();
  }

  async updateElo(joueurId: number, newElo: number, typePartie: TypePartie) {
    // Trouver le classement actuel du joueur
    const classement = await this.classementRepository.findOne({
      where: { user_id: { idJoueur: joueurId } },
    });
    // Vérifier si le classement a été trouvé
    if (!classement) {
      throw new NotFoundException('Classement introuvable pour cet utilisateur');
    }
    classement[typePartie] = newElo;
    await this.classementRepository.save(classement);
  }
}





