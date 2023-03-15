import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { hashPassword } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';
import { JoueurDto } from './DTO/joueurs.dto';
import { Joueur } from './entities/joueur.entity';

@Injectable()
export class JoueursService {
  /*updateJoueur(idJoueur: number | import("typeorm").FindOperator<number>) {
    throw new Error('Method not implemented.');
  }*/
  //injecter le repository de la table joueur
  constructor(
    @InjectRepository(Joueur)
    private readonly joueursRepository: Repository<Joueur>,
  ) {}
  //Retrouver un joueur avec le Repository
  async findJoueur(joueur: JoueurDto): Promise<Joueur> {
    const joueurTrouve = await this.joueursRepository.findOneBy({ pseudo: joueur.pseudo });
    if (!joueur) {
      throw new Error(`Le joueur avec le pseudo ${joueur.pseudo} n'a pas été trouvé`);
    }
    return joueurTrouve;
  }
  
  //Pour s'assurer que l'adresse mail n'est pas déjà utilisée
  async createAdresse(joueur: JoueurDto) {
    const existingUser = await this.joueursRepository.findOneBy({ adresseMail: joueur.adresseMail });
    if (existingUser) {
      throw new Error('Cette adresse mail est déjà utilisée');
    }
  }

  //Enregistrer un joueur avec le Repository
  async inscriptionJoueur(joueurDto: JoueurDto): Promise<Joueur> {
    const joueur = new Joueur();
    joueur.pseudo = joueurDto.pseudo;
    //verifier que l'adresse mail n'est pas déjà utilisée avant de créer le joueur
    await this.createAdresse(joueurDto);
    joueur.adresseMail = joueurDto.adresseMail;
    joueur.motDePasse = hashPassword(joueurDto.motDePasse);
    return await this.joueursRepository.save(joueur);
  }
  
  
  //modifier un joueur avec le Repository
  async modifierJoueur(joueurDto: JoueurDto) {
    const joueur = await this.joueursRepository.findOneBy({pseudo: joueurDto.pseudo});
    if (!joueur) {
      throw new Error(`Le joueur avec l'ID ${joueurDto.pseudo} n'a pas été trouvé`);
    }
    // Si un nouveau mot de passe a été fourni, on le hash avant de le sauvegarder
    if (joueurDto.motDePasse) {
      joueur.motDePasse = hashPassword(joueurDto.motDePasse);
    }
    if(joueurDto.pseudo){
      joueur.pseudo = joueurDto.pseudo;
    }
   
    await this.joueursRepository.save(joueur);
    return joueur;
  }
  

  /*
  async updateJoueur(idJoueur: number, joueur: JoueurDto) {
    const joueurUpdate = await this.joueursRepository.findOne(idJoueur);
    if (joueurUpdate) {
      const joueurUpdate = await this.joueursRepository.update(idJoueur, joueur);
      return joueurUpdate;
    }
  }*/
}
