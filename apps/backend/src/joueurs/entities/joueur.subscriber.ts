/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { PlayerNotFound } from 'src/errors/bErrors';
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, Repository} from 'typeorm';
import { JoueursService } from '../joueurs.service';
import { Joueur } from './joueur.entity';

@Injectable()
@EventSubscriber()
export class JoueurSubscriber implements EntitySubscriberInterface<Joueur> {

  constructor(private readonly joueurService: JoueursService,
              @InjectConnection() private connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Joueur;
  }

  async addTag(event: InsertEvent<Joueur>) {
    console.log(event.entity);
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    event.entity.tagJoueur = `${randomNumber}`;
    event.entity.fullpseudo = `${event.entity.pseudo}#${event.entity.tagJoueur}`;
    event.entity.amis = [];
  }

  async conflictAddTag(event: InsertEvent<Joueur> , sameName: Joueur) {
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


  async beforeInsert(event: InsertEvent<Joueur>) {
    try {
      const sameName = await this.joueurService.findJoueurByPseudo({
        pseudo: event.entity.pseudo,
      });
      await this.conflictAddTag(event, sameName);
    } catch (error: unknown) {
      if (error instanceof PlayerNotFound) {
        await this.addTag(event);
      } else 
        throw error;
    }
  }
}