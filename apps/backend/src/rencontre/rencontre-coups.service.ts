import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rencontre } from './entities/rencontre.entity';
import { Coups } from 'src/coups/entities/coups.entity';
import { JoueurDto } from 'src/joueurs/DTO/joueurs.dto';
import { JoueursService } from 'src/joueurs/joueurs.service';
import { ClassementService } from 'src/classement/classement.service';

export interface RencontreWithPseudos {
  pseudoJoueurBlanc: string;
  pseudoJoueurNoir: string;
  vainqueur: number;
}

@Injectable()
export class RencontreCoupsService {
  constructor(
    @InjectRepository(Rencontre)
    private rencontreRepository: Repository<Rencontre>,
    @InjectRepository(Coups)
    private coupsRepository: Repository<Coups>,
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

    return this.rencontreRepository.save(newRencontre);
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

  async getPartiesDetailsPourJoueur(joueur: JoueurDto): Promise<any> {
    const rencontres = await this.rencontreRepository.find({
      where: [
        { joueurBlanc: { idJoueur: joueur.idJoueur } },
        { joueurNoir: { idJoueur: joueur.idJoueur } },
      ],
      relations: ['joueurBlanc', 'joueurNoir'],
    });

    if (!rencontres || rencontres.length === 0) {
      throw new Error('Aucune rencontre trouvée pour ce joueur');
    }

    const result = [];

    for (const rencontre of rencontres) {

      const nombreDeCoups = await this.coupsRepository
      .createQueryBuilder("coups")
      .where("coups.idRencontreIdRencontre = :idRencontre", { idRencontre: rencontre.idRencontre })
      .getCount();

      const eloBlanc = await this.classementService.getEloByUserId(rencontre.joueurBlanc.toDto());
      const eloNoir = await this.classementService.getEloByUserId(rencontre.joueurNoir.toDto());

      result.push({
        idRencontre: rencontre.idRencontre,
        nombreDeCoups,
        resultat: rencontre.vainqueur === rencontre.joueurBlanc.idJoueur ? 'Blanc' : 'Noir',
        joueurBlanc: {
          pseudo: rencontre.joueurBlanc.pseudo,
          elo: eloBlanc,
        },
        joueurNoir: {
          pseudo: rencontre.joueurNoir.pseudo,
          elo: eloNoir,
        },
      });
    }

    return result;
  }

  async getCoupsForRencontre(idRencontre: number): Promise<Coups[]> {
    return this.coupsRepository.createQueryBuilder('coups')
      .where('coups.idRencontreIdRencontre = :idRencontre', { idRencontre })
      .orderBy('coups.ordre', 'ASC')
      .getMany();
  }
  
}

