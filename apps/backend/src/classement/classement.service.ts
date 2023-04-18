import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassementNotFound, PlayerNotFound } from 'src/errors/bErrors';
import { Repository } from 'typeorm';
import { ClassementDto } from './DTO/classement.dto';
import { Classement, TypePartie } from './entities/classement.entity';
import { DeepPartial } from 'typeorm';
import { Joueur } from 'src/joueurs/entities/joueur.entity';

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

  async getMyHighestElo(userId: Joueur, typePartie: TypePartie) {
    const classement = await this.classementRepository.findOne({
      where: { user_id: userId },
    });

    if (!classement) {
      throw new NotFoundException('Classement introuvable pour cet utilisateur');
    }

    return classement[typePartie];
  }

  async getEloByUserId(userId: Joueur) {

    const classement = await this.classementRepository.findOne({
      where: { user_id: userId },
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

  async getEloByUserIdAndTypePartie(userId: number) {
    const dernierClassement = await this.classementRepository
      .createQueryBuilder('classement')
      .select('classement.elo_bullet')
      .where('classement.user_id = :userId', { userId })
      .getOne();
    return dernierClassement;
  }


  async getMyRank(userId: Joueur, typePartie: TypePartie) {
    try {
      // Récupérer les classements de la partie demandée
      const ranks = await this.fetchRanks(typePartie);
      // Trouver le rang du joueur parmi les classements récupérés
      const myRank = ranks.findIndex(rank => rank.userId === userId.idJoueur) + 1;
      // Retourner le rang du joueur
      return myRank;
    } catch (error) {
      // Gérer les erreurs et retourner -1 en cas d'erreur
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


}





