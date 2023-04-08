import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rencontre } from './entities/rencontre.entity';
import { RencontreDTO } from './DTO/rencontre.dto';
import { Repository } from 'typeorm';
import { Joueur } from 'src/joueurs/entities/joueur.entity';
import { JoueurDto } from 'src/joueurs/DTO/joueurs.dto';
import { PlayerNotFound } from 'src/errors/bErrors';

@Injectable()
export class RencontreService {
  partieRepository: any;
  
 
  
  constructor(
    @InjectRepository(Joueur)
    private readonly joueurRepository: Repository<Joueur>,
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
      return nbreDefaite;
  }

  async nombreNul(joueur: Pick<RencontreDTO, "joueurBlanc" | "joueurNoir">) {
    const nbreNul= this.rencontreRepository
      .createQueryBuilder('rencontre')
      .select('COUNT(*)', 'nbreNul')
      .where("rencontre.vainqueur IS NULL AND (rencontre.joueurBlanc = :joueur OR rencontre.joueurNoir = :joueur", { joueur: joueur })
      .getRawOne();
      return nbreNul;
  }

  //recupere toutes les rencontres d'un joueur
  //JE SAIS PAS AVEC QUEL MÉTHODE
  async toutesRencontres(fullpseudo: Pick<Joueur, 'fullpseudo'>) {
    /*const joueur=await this.joueurRepository.findOne({
      where:{
        fullpseudo: fullpseudo.fullpseudo,
      }});

      if(!joueur) throw new PlayerNotFound();*/
    
    const toutesRencontres= await this.rencontreRepository
      .createQueryBuilder('rencontre')
      .leftJoinAndSelect('rencontre.joueurBlanc', 'joueurBlanc')
      .leftJoinAndSelect('rencontre.joueurNoir', 'joueurNoir')
      .where('joueurBlanc.fullpseudo = :fullpseudo OR joueurNoir.fullpseudo = fullpseudo', { fullpseudo: fullpseudo })
      .andWhere(
        qb=>{
          const subQuery=qb
          .subQuery()
          .select('joueur.idJoueur')
          .from(Joueur, 'joueur')
          .where('joueur.fullpseudo = :fullpseudo', { fullpseudo: fullpseudo })
          .getQuery();
          return 'rencontre.joueurBlanc = '+subQuery+' OR rencontre.joueurNoir = '+subQuery;
        })
      .getMany();
      return toutesRencontres;
  }
  
//recupere date rencontre PAS SUR
  async dateRencontre(fullpseudo: Pick<Joueur, 'fullpseudo'>) {
    const joueur=await this.joueurRepository.findOne({
      where:{
        fullpseudo: fullpseudo.fullpseudo,
      }});
      if(!joueur) throw new PlayerNotFound();

    const dateRencontre= await this.partieRepository
      .createQueryBuilder('partie')
      .leftJoin('partie.idRencontre', 'rencontre')
      .leftJoin('rencontre.joueurBlanc', 'joueurBlanc')
      .leftJoin('rencontre.joueurNoir', 'joueurNoir')
      .where('(joueurBlanc.fullpseudo = :fullpseudo OR joueurNoir.fullpseudo = fullpseudo )', { fullpseudo: fullpseudo.fullpseudo })
      .select('partie.datePartie')
      .getRawOne();
      return dateRencontre;
    }
}
