/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, Repository} from 'typeorm';
import { Joueur } from './joueur.entity';

@Injectable()
@EventSubscriber()
export class JoueurSubscriber implements EntitySubscriberInterface<Joueur> {

  constructor(@InjectRepository(Joueur) private readonly joueurRepository: Repository<Joueur>) {
  }

  listenTo() {
    return Joueur;
  }

  async beforeInsert(event: InsertEvent<Joueur>) {
    const sameName = await this.joueurRepository.findOneBy({ pseudo: event.entity.pseudo });
    let randomNumber = Math.floor(Math.random() * 9000) + 1000;
    if (sameName) {
      while (sameName.tagJoueur === `${randomNumber}`) {
        randomNumber = Math.floor(Math.random() * 9000) + 1000;
      }
    }
    event.entity.tagJoueur = `${randomNumber}`;
    event.entity.fullpseudo = `${event.entity.pseudo}#${event.entity.tagJoueur}`;
    event.entity.amis = [];
  }
}