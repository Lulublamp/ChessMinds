import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rencontre } from './entities/rencontre.entity';
import { RencontreDTO } from './DTO/rencontre.dto';
import { Repository } from 'typeorm';
import { Joueur } from 'src/joueurs/entities/joueur.entity';
import { JoueurDto } from 'src/joueurs/DTO/joueurs.dto';
import { PlayerNotFound } from 'src/errors/bErrors';
import { Partie } from 'src/partie/entities/partie.entity';

@Injectable()
export class RencontreService {
  /*
  constructor(
    @InjectRepository(Joueur)
    private readonly joueurRepository: Repository<Joueur>,
    @InjectRepository(Rencontre)
    private readonly rencontreRepository: Repository<Rencontre>,
    @InjectRepository(Partie)
    private readonly partieRepository: Repository<Partie>,
  ) {}

  async nombreRencontre(joueur: Pick<Joueur,'fullpseudo'>) {
    const nbreRencontre= await this.rencontreRepository
      .createQueryBuilder('rencontre')
      .where(
        'rencontre.joueurBlanc.fullpseudo = :joueur OR rencontre.joueurNoir.fullpseudo = :joueur', { joueur: joueur.fullpseudo })
      .getCount();
      return nbreRencontre;
  }


  async nombreVictoire(joueur: Pick<Joueur,'fullpseudo' | 'idJoueur'>){
    const nbreVictoire= this.rencontreRepository
      .createQueryBuilder('rencontre')
      .where(
        "rencontre.vainqueur = :id AND (rencontre.joueurBlanc = :joueur OR rencontre.joueurNoir = :joueur",
        { 
          id: joueur.idJoueur,
          joueur: joueur.fullpseudo 
        }
      )
      .getCount();
      return nbreVictoire;
  }

  async nombreDefaite(joueur: Pick<Joueur, 'fullpseudo' | 'idJoueur'>) {
    const nbreDefaite= this.rencontreRepository
      .createQueryBuilder('rencontre')
      .where("rencontre.vainqueur != :id AND (rencontre.joueurBlanc.fullpseudo = :joueur OR rencontre.joueurNoir = :joueur", 
      { 
        id: joueur.idJoueur,
        joueur: joueur.fullpseudo,
      })
      .getCount();
      return nbreDefaite;
  }

  async nombreNul(joueur: Pick<Joueur, 'fullpseudo'>) {
    const nbreNul= this.rencontreRepository
      .createQueryBuilder('rencontre')
      .where("rencontre.vainqueur IS NULL AND (rencontre.joueurBlanc.fullpseudo = :joueur OR rencontre.joueurNoir = :joueur", 
      { joueur: joueur.fullpseudo })
      .getCount();
      return nbreNul;
  }


  //recupere toutes les rencontres d'un joueur
  //JE SAIS PAS AVEC QUEL MÉTHODE
  async toutesRencontres(fullpseudo: Pick<Joueur, 'fullpseudo'>) {
    const joueur=await this.joueurRepository.findOne({
      where:{
        fullpseudo: fullpseudo.fullpseudo,
      }});

      if(!joueur) throw new PlayerNotFound();
    
    const toutesRencontres= await this.rencontreRepository
      .createQueryBuilder('rencontre')
      .where('rencontre.joueurBlanc.fullpseudo = :fullpseudo OR joueurNoir.fullpseudo = :fullpseudo', { fullpseudo: fullpseudo })
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
      .where('(joueurBlanc.fullpseudo = :fullpseudo OR joueurNoir.fullpseudo = :fullpseudo )', { fullpseudo: fullpseudo.fullpseudo })
      .select('partie.datePartie')
      .getRawOne();
      return dateRencontre;
    }*/
}
