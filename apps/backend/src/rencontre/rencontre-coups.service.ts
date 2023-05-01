import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partie } from 'src/partie/entities/partie.entity';
import { Rencontre } from './entities/rencontre.entity';
import { Coups } from 'src/coups/entities/coups.entity';
import { JoueurDto } from 'src/joueurs/DTO/joueurs.dto';
import { JoueursService } from 'src/joueurs/joueurs.service';
import { ClassementService } from 'src/classement/classement.service';
import { Nt } from '@TRPI/core';

export interface RencontreWithPseudos {
  pseudoJoueurBlanc: string;
  pseudoJoueurNoir: string;
  vainqueur: number;
  timer: Nt.MATCHMAKING_MODES_TIMERS;
}

@Injectable()
export class RencontreCoupsService {
  constructor(
    @InjectRepository(Rencontre)
    private rencontreRepository: Repository<Rencontre>,
    @InjectRepository(Coups)
    private coupsRepository: Repository<Coups>,
    @InjectRepository(Partie)
    private partieRepository: Repository<Partie>,
    private joueurService: JoueursService,
    private classementService: ClassementService,
  ) { }

  async saveRencontre(rencontre: Partial<RencontreWithPseudos>): Promise<Rencontre> {
    const joueurBlanc = await this.joueurService.findJoueurByPseudo({ pseudo: rencontre.pseudoJoueurBlanc });
    const joueurNoir = await this.joueurService.findJoueurByPseudo({ pseudo: rencontre.pseudoJoueurNoir });

    const newRencontre = this.rencontreRepository.create({
      joueurBlanc,
      joueurNoir,
      vainqueur: rencontre.vainqueur,
    });

    const savedRencontre = await this.rencontreRepository.save(newRencontre);

    const eloBlanc = (await this.classementService.getEloByUserId(joueurBlanc.toDto()));
    const eloNoir = (await this.classementService.getEloByUserId(joueurNoir.toDto()));

    let eloB = rencontre.timer === Nt.MATCHMAKING_MODES_TIMERS.BULLET ? eloBlanc.elo_bullet :
      rencontre.timer === Nt.MATCHMAKING_MODES_TIMERS.BLITZ ? eloBlanc.elo_blitz : eloBlanc.elo_rapide;

    let eloN = rencontre.timer === Nt.MATCHMAKING_MODES_TIMERS.BULLET ? eloNoir.elo_bullet :
      rencontre.timer === Nt.MATCHMAKING_MODES_TIMERS.BLITZ ? eloNoir.elo_blitz : eloNoir.elo_rapide;

    // Créez une nouvelle instance de Partie
    const newPartie = this.partieRepository.create({
      rencontre: savedRencontre,
      datePartie: new Date(),
      eloBlanc: eloB,
      eloNoir: eloN,
    });

    // Sauvegardez la Partie
    await this.partieRepository.save(newPartie);

    return savedRencontre;
  }

  async saveCoup(coup: Partial<Coups>): Promise<Coups> {
    return this.coupsRepository.save(coup);
  }

  async getStats(joueur: JoueurDto): Promise<{ victoires: number; defaites: number; parties: number }> {
    const victoires = await this.rencontreRepository.count({ where: { vainqueur: joueur.idJoueur } });
    const parties = await this.rencontreRepository.count({
      where: [{ joueurBlanc: joueur }, { joueurNoir: joueur }],
    });

    const defaites = parties - victoires;
    return { victoires, defaites, parties };
  }

  async getPartiesDetailsPourJoueur(joueur: JoueurDto): Promise<Rencontre[]> {
    return this.rencontreRepository
      .createQueryBuilder('rencontre')
      .leftJoinAndSelect('rencontre.joueurBlanc', 'joueurBlanc')
      .leftJoinAndSelect('rencontre.joueurNoir', 'joueurNoir')
      .leftJoinAndSelect('rencontre.partie', 'partie')
      .leftJoinAndSelect('rencontre.coups', 'coups')
      .where('rencontre.joueurBlanc = :id', { id: joueur.idJoueur })
      .orWhere('rencontre.joueurNoir = :id', { id: joueur.idJoueur })
      .getMany();
  }

  async getCoupsForRencontre(idRencontre: number): Promise<Coups[]> {
    return this.coupsRepository.createQueryBuilder('coups')
      .where('coups.idRencontreIdRencontre = :idRencontre', { idRencontre })
      .orderBy('coups.ordre', 'ASC')
      .getMany();
  }

}

