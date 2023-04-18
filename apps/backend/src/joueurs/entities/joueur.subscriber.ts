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

}