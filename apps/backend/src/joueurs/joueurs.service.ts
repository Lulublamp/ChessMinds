import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { create } from 'domain';
import { resolve } from 'path';
import {
  AlreadyFriends,
  EmailPlayerAlreadyExists,
  PseudoPlayerAlreadyExists,
  PlayerNotCreated,
  PlayerNotFound,
  NotFriends,
} from 'src/errors/bErrors';
import { comparePassword, hashPassword } from 'src/utils/bcrypt';
import { Brackets, Repository } from 'typeorm';
import { JoueurDto } from './DTO/joueurs.dto';
import { Joueur } from './entities/joueur.entity';
import { Amis } from 'src/amis/entities/amis.entity';
import { ClassementService } from 'src/classement/classement.service';

@Injectable()
export class JoueursService {
  constructor(
    @InjectRepository(Joueur)
    private readonly joueursRepository: Repository<Joueur>,
    private readonly classementService: ClassementService,
    @InjectRepository(Amis)
    private amisRepository: Repository<Amis>
  ) { }

  async inscriptionJoueur(joueur: Joueur): Promise<Joueur> {
    const existingJoueurByEmail = await this.joueursRepository.findOne({
      where: { adresseMail: joueur.adresseMail },
    });
    const existingJoueurByPseudo = await this.joueursRepository.findOne({
      where: { pseudo: joueur.pseudo },
    });
    if (existingJoueurByEmail) {
      throw new EmailPlayerAlreadyExists();
    }
    if (existingJoueurByPseudo) {
      throw new PseudoPlayerAlreadyExists();
    }

    try {
      joueur.motDePasse = await hashPassword(joueur.motDePasse);
      const newJoueur = this.joueursRepository.create(joueur);
      const joueurCree = await this.joueursRepository.save(newJoueur);

      await this.classementService.creerClassement({
        user_id: joueurCree,
        elo_blitz: 800,
        elo_bullet: 800,
        elo_rapide: 800,
        elo_max_blitz: 800,
        elo_max_bullet: 800,
        elo_max_rapide: 800,
      });
      console.log('Joueur créé' + joueurCree.idJoueur);
      return joueurCree;
    } catch (error) {
      throw new PlayerNotCreated();
    }
  }

  async connexionJoueur(
    adresseMail: string,
    motDePasse: string,
  ): Promise<Joueur | null> {
    const joueur = await this.joueursRepository.findOne({
      where: { adresseMail: adresseMail },
    });

    if (!joueur || !comparePassword(motDePasse, joueur.motDePasse)) {
      return null;
    }

    return joueur;
  }

  async findJoueurById(id: number): Promise<Joueur> {
    const joueurTrouve = await this.joueursRepository.findOne({
      where: {
        idJoueur: id,
      },
    });
    if (!joueurTrouve) {
      throw new PlayerNotFound();
    }
    return joueurTrouve;
  }

  async findJoueurByEmail(
    email: Pick<JoueurDto, 'adresseMail'>,
  ): Promise<Joueur> {
    const joueurTrouve = await this.joueursRepository.findOne({
      where: {
        adresseMail: email.adresseMail,
      },
    });
    if (!joueurTrouve) {
      throw new PlayerNotFound();
    }
    return joueurTrouve;
  }

  async findJoueurByFullPseudo(query: Pick<Joueur, 'pseudo'>): Promise<Joueur> {
    const joueurTrouve = await this.joueursRepository.findOne({
      where: {
        pseudo: query.pseudo,
      },
    });
    if (!joueurTrouve) {
      throw new PlayerNotFound();
    }
    return joueurTrouve;
  }

  async findJoueurByPseudo(query: Pick<Joueur, 'pseudo'>): Promise<Joueur> {
    const joueurTrouve = await this.joueursRepository.findOne({
      where: {
        pseudo: query.pseudo,
      },
    });
    if (!joueurTrouve) {
      throw new PlayerNotFound();
    }
    return joueurTrouve;
  }

  async addFriend(joueurId: number, friendId: number) {
    const joueur = await this.joueursRepository.findOne({ where: { idJoueur: joueurId }, relations: ['amis'] });
    const maybeFriend = await this.joueursRepository.findOne({ where: { idJoueur: friendId }, relations: ['amis'] });
    if (!joueur || !maybeFriend) {
      throw new PlayerNotFound();
    }
    if (joueur.amis.some(amis => amis.idJoueur === maybeFriend.idJoueur)) {
      throw new AlreadyFriends();
    }
    joueur.amis.push(maybeFriend);
    maybeFriend.amis.push(joueur);
    try {
      await this.joueursRepository.save(joueur);
      await this.joueursRepository.save(maybeFriend);
      console.log('Friend added');
    } catch (error) {
      console.error(error);
      throw new Error('Could not add friend');
    }
  }

  async removeFriend(joueurId: number, friendId: number) {
    const joueur = await this.joueursRepository.findOne({ where: { idJoueur: joueurId }, relations: ['amis'] });
    const maybeFriend = await this.joueursRepository.findOne({ where: { idJoueur: friendId }, relations: ['amis'] });
    if (!joueur || !maybeFriend) {
      throw new PlayerNotFound();
    }
    if (!joueur.amis.some(amis => amis.idJoueur === maybeFriend.idJoueur)) {
      throw new NotFriends();
    }
    joueur.amis = joueur.amis.filter(amis => amis.idJoueur !== maybeFriend.idJoueur);
    maybeFriend.amis = maybeFriend.amis.filter(amis => amis.idJoueur !== joueur.idJoueur);
    try {
      await this.joueursRepository.save(joueur);
      await this.joueursRepository.save(maybeFriend);
      console.log('Friend removed');
    } catch (error) {
      console.error(error);
      throw new Error('Could not remove friend');
    }
  }
  
  async getAmis(joueur: Joueur): Promise<Joueur[]> {
    const joueurTrouve = await this.joueursRepository.findOne({
      where: { idJoueur: joueur.idJoueur },
      relations: ['amis'],
    });
    if (!joueurTrouve) {
      throw new Error('Joueur introuvable');
    }
    return joueurTrouve.amis;
  }

  async getDateInscription(joueur: Joueur): Promise<Date> {
    const joueurTrouve = await this.joueursRepository.findOne({
      where: { idJoueur: joueur.idJoueur },
    });
    if (!joueurTrouve) {
      throw new Error('Joueur introuvable');
    }
    return joueurTrouve.dateInscription;
  }

  async updatePseudo(joueurId: number, nouveauPseudo: string): Promise<Joueur> {
    const joueur = await this.joueursRepository.findOne({
      where: { idJoueur: joueurId },
    });
    if (!joueur) {
      throw new PlayerNotFound();
    }
    const existingJoueurByPseudo = await this.joueursRepository.findOne({
      where: { pseudo: nouveauPseudo },
    });
    if (existingJoueurByPseudo) {
      throw new PseudoPlayerAlreadyExists();
    }
    joueur.pseudo = nouveauPseudo;
    const joueurMisAJour = await this.joueursRepository.save(joueur);
    return joueurMisAJour;
  }

  async updateEmail(joueurId: number, nouveauEmail: string): Promise<Joueur> {
    const joueur = await this.joueursRepository.findOne({
      where: { idJoueur: joueurId },
    });
    if (!joueur) {
      throw new PlayerNotFound();
    }
    const existingJoueurByEmail = await this.joueursRepository.findOne({
      where: { adresseMail: nouveauEmail },
    });
    if (existingJoueurByEmail) {
      throw new EmailPlayerAlreadyExists();
    }
    joueur.adresseMail = nouveauEmail;
    const joueurMisAJour = await this.joueursRepository.save(joueur);
    return joueurMisAJour;
  }

  async updateIconId(joueurId: number, nouvelIconId: number): Promise<Joueur> {
    const joueur = await this.joueursRepository.findOne({
      where: { idJoueur: joueurId },
    });

    if (!joueur) {
      throw new PlayerNotFound();
    }

    joueur.image = nouvelIconId;

    const joueurMisAJour = await this.joueursRepository.save(joueur);
    return joueurMisAJour;
  }

  async getPlayerDetails(joueurId: number): Promise<any> {
    const joueur = await this.joueursRepository.findOne({
      where: { idJoueur: joueurId },
    });
    if (!joueur) {
      throw new PlayerNotFound();
    }
    const classement = await this.classementService.getEloByUserId(joueur.toDto());
    if (!classement) {
      throw new Error('Classement introuvable');
    }
    return {
      pseudo: joueur.pseudo,
      image: joueur.image,
      eloActuelle: {
        blitz: classement.elo_blitz,
        bullet: classement.elo_bullet,
        rapide: classement.elo_rapide,
      },
      dateInscription : joueur.dateInscription,
    };
  }

  async areFriends(joueurId: number, friendId: number): Promise<boolean> {
    const joueur = await this.joueursRepository.findOne({ where: { idJoueur: joueurId }, relations: ['amis'] });
    const maybeFriend = await this.joueursRepository.findOne({ where: { idJoueur: friendId }, relations: ['amis'] });
    if (!joueur || !maybeFriend) {
      throw new PlayerNotFound();
    }
    return joueur.amis.some(amis => amis.idJoueur === maybeFriend.idJoueur);
  }
  
  async getFriends(joueurId: number): Promise<number[]> {
    const joueur = await this.joueursRepository.findOne({ where: { idJoueur: joueurId }, relations: ['amis'] });
    if (!joueur) {
      throw new PlayerNotFound();
    }
    return joueur.amis.map(amis => amis.idJoueur);
  }

}
