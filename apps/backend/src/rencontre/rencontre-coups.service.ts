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
import { TypePartie } from 'src/classement/entities/classement.entity';
import { Joueur } from 'src/joueurs/entities/joueur.entity';

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

  public calculateEloGain(player: { Elo: number; score: number; }, opponent: { Elo: number; score: number; }, kFactor: number): number {
    const expectedScore = 1 / (1 + Math.pow(10, (opponent.Elo - player.Elo) / 400));
    const newRating = player.Elo + kFactor * (player.score - expectedScore);
    return Math.round(newRating);
  }

  public calculateKFactor(rating: number): number {
    if (rating < 2000) {
      return 40;
    } else if (rating < 2400) {
      return 20;
    } else {
      return 10;
    }
  }

  async saveRencontre(rencontre: Partial<RencontreWithPseudos>, isRanked: boolean) {
    const joueurBlanc = await this.joueurService.findJoueurByPseudo({ pseudo: rencontre.pseudoJoueurBlanc });
    const joueurNoir = await this.joueurService.findJoueurByPseudo({ pseudo: rencontre.pseudoJoueurNoir });
    console.log('winner' + rencontre.vainqueur);
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
    await this.partieRepository.save(newPartie);
    // Sauvegardez la Partie
    if (isRanked) {
      //update elo
      const kFactorB = this.calculateKFactor(eloB);
      const kFactorN = this.calculateKFactor(eloN);
      const scoreBlanc = rencontre.vainqueur === 0 ? 1 : rencontre.vainqueur === 0.5 ? 0.5 : 0;
      const scoreNoir = rencontre.vainqueur === 1 ? 1 : rencontre.vainqueur === 0.5 ? 0.5 : 0;
      const newEloB = this.calculateEloGain({ Elo: eloB, score: scoreBlanc }, { Elo: eloN, score: scoreNoir }, kFactorB);
      const newEloN = this.calculateEloGain({ Elo: eloN, score: scoreNoir}, { Elo: eloB, score: scoreBlanc }, kFactorN);
      if (rencontre.timer === Nt.MATCHMAKING_MODES_TIMERS.BULLET) {
        await this.classementService.updateElo(joueurBlanc.idJoueur, newEloB, TypePartie.BULLET);
        await this.classementService.updateElo(joueurNoir.idJoueur, newEloN, TypePartie.BULLET);
      } else if (rencontre.timer === Nt.MATCHMAKING_MODES_TIMERS.BLITZ) {
        await this.classementService.updateElo(joueurBlanc.idJoueur, newEloB, TypePartie.BLITZ);
        await this.classementService.updateElo(joueurNoir.idJoueur, newEloN, TypePartie.BLITZ);
      } else {
        await this.classementService.updateElo(joueurBlanc.idJoueur, newEloB, TypePartie.RAPIDE);
        await this.classementService.updateElo(joueurNoir.idJoueur, newEloN, TypePartie.RAPIDE);
      }
      console.log('elo gain joueur blanc : ' + newEloB);
      console.log('elo gain joueur noir : ' + newEloN);
    }
    return savedRencontre;
  }

  async saveCoup(coup: Partial<Coups>): Promise<Coups> {
    return this.coupsRepository.save(coup);
  }

  async getStats(joueur: JoueurDto): Promise<{ victoires: number; defaites: number; parties: number }> { 
    const victoiresBlanc = await this.rencontreRepository.count({ where: { vainqueur: 0, joueurBlanc : joueur } });
    const victoiresNoir = await this.rencontreRepository.count({ where: { vainqueur: 1, joueurNoir: joueur } });
    const nuls = await this.rencontreRepository.count({ where: { vainqueur: 0.5, joueurBlanc: joueur } }) + await this.rencontreRepository.count({ where: { vainqueur: 0.5, joueurNoir: joueur } });
    const victoires = victoiresBlanc + victoiresNoir;
    const parties = await this.rencontreRepository.count({
      where: [{ joueurBlanc: joueur }, { joueurNoir: joueur }],
    });
    console.log('partie : ' + parties);
    const defaites = parties - victoires - nuls;
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

