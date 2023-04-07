import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rencontre } from './entities/rencontre.entity';
import { RencontreDTO } from './DTO/rencontre.dto';
import { Repository } from 'typeorm';

@Injectable()
export class RencontreService {
  
  
  constructor(
    @InjectRepository(Rencontre)
    private readonly rencontreRepository: Repository<Rencontre>,
  ) {}

  async nombreRencontre(joueur: Pick<RencontreDTO, 'joueurBlanc' | 'joueurNoir'>) {
    const nbreRencontre= await this.rencontreRepository
      .createQueryBuilder('rencontre')
      .select('COUNT(*)', 'nbreRencontre')
      .where('rencontre.joueurBlanc = :joueur OR rencontre.joueurNoir = :joueur', { joueur: joueur })
      .getRawOne();
      return nbreRencontre;
  }


  async nombreVictoire(joueur: Pick<RencontreDTO, "joueurBlanc" | "joueurNoir">) {
    const nbreVictoire= this.rencontreRepository
      .createQueryBuilder('rencontre')
      .select('COUNT(*)', 'nbreVictoire')
      .where("rencontre.vainqueur = :joueur AND (rencontre.joueurBlanc = :joueur OR rencontre.joueurNoir = :joueur", { joueur: joueur })
      .getRawOne();
      return nbreVictoire;
  }

  async nombreDefaite(joueur: Pick<RencontreDTO, "joueurBlanc" | "joueurNoir">) {
    const nbreDefaite= this.rencontreRepository
      .createQueryBuilder('rencontre')
      .select('COUNT(*)', 'nbreDefaite')
      .where("rencontre.vainqueur != :joueur AND (rencontre.joueurBlanc = :joueur OR rencontre.joueurNoir = :joueur", { joueur: joueur })
      .getRawOne();
  }

  
}
