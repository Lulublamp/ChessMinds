import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { hashPassword } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';
import { JoueurDto } from './DTO/joueurs.dto';
import { Joueur } from './entities/joueur.entity';

@Injectable()
export class JoueursService {
  //injecter le repository de la table joueur
  constructor(
    @InjectRepository(Joueur)
    private readonly joueursRepository: Repository<Joueur>,
  ) {}
  //retrouver un joueur avec le Repository
  async findJoueur(idJoueur: number) {
    return await this.joueursRepository.find();
    //id du joueur fait une erreur je sais pas pk à voir ca
  }

  //enregistrer un joueur avec le Repository
  async inscriptionJoueur(joueur: JoueurDto) {
    //hashage du mot de passe
    const motDePasse= hashPassword(joueur.motDePasse);
    const joueurInscrit = this.joueursRepository.create({...joueur,motDePasse});
    return await this.joueursRepository.save(joueurInscrit);
  }

//Pour s'assurer que l'adresse mail n'est pas déjà utilisée
  async createAdresse(joueur: JoueurDto) {
    const existingUser = await this.joueursRepository.findOneBy({ adresseMail: joueur.adresseMail });
    if (existingUser) {
      throw new Error('Cette adresse mail est déjà utilisée');
    }
    return this.joueursRepository.save(joueur);
  }
  //modifier un joueur avec le Repository
  updateJoueur(idJoueur:number, joueur: JoueurDto) {
    const joueurUpdate = this.joueursRepository.update(idJoueur, joueur);
    return joueurUpdate;
  }
}
