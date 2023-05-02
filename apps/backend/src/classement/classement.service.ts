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

  async getEloByUserIdAndTypePartie(joueurDto: JoueurDto, typePartie: TypePartie) {
    const dernierClassement = await this.classementRepository
      .createQueryBuilder('classement')
      .select(`classement.${typePartie}`)
      .where('classement.user_id = :userId', { userId: { idJoueur: joueurDto.idJoueur } })
      .getOne();
    return dernierClassement;
  }

  async getMyRank(joueurDto: JoueurDto, typePartie: TypePartie): Promise<number> {
    try {
      const ranks = await this.fetchRanks(typePartie);
      const myRank = ranks.findIndex(rank => rank.userId === joueurDto.idJoueur) + 1;
      return myRank;
    } catch (error) {
      console.error('Erreur lors de la récupération du rang:', error);
      return -1;
    }
  }

  async fetchRanks(typePartie: TypePartie): Promise<Array<{ userId: number, rank: number }>> {
    // Récupérer les classements de la partie demandée
    const ranks = await this.classementRepository
      .createQueryBuilder('classement')
      .addSelect('classement.user_id', 'userId')
      .addSelect(`classement.${typePartie}`, 'rank')
      .orderBy(`classement.${typePartie}`, 'DESC')
      .getRawMany();
    // Vérifier si des classements ont été trouvés
    if (!ranks || ranks.length === 0) {
      throw new ClassementNotFound();
    }
    // Mapper les résultats pour correspondre au type attendu
    const mappedRanks = ranks.map(rank => ({
      userId: rank.userId,
      rank: rank.rank,
    }));
    return mappedRanks;
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





