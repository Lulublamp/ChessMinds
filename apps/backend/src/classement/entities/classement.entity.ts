import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Joueur } from '../../joueurs/entities/joueur.entity';

export enum TypePartie {
  RAPIDE = 'elo_rapide',
  BULLET = 'elo_bullet',
  BLITZ = 'elo_blitz',
  RAPIDE_MAX = 'elo_max_rapide',
  BULLET_MAX = 'elo_max_bullet',
  BLITZ_MAX = 'elo_max_blitz',
}

@Entity()
export class Classement {
  @PrimaryGeneratedColumn()
  idClassement: number;

  @OneToOne(() => Joueur, {nullable:false})
  @JoinColumn({name: 'user_id'})
  user_id: Joueur;

  //Pour partie Rapide
  @Column({nullable:false})
  elo_blitz: number;

  @Column({nullable:false})
  elo_bullet: number;

  //Pour partie Bullet
  @Column({nullable:false})
  elo_rapide: number;

  @Column({nullable:false})
  elo_max_blitz: number;

  //Pour partie Blitz
  @Column({nullable:false})
  elo_max_bullet: number;

  @Column({nullable:false})
  elo_max_rapide: number;
}
