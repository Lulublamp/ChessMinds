/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Joueur } from '../../joueurs/entities/joueur.entity';

export enum TypePartie {
  RAPIDE = 'ELORapide',
  BULLET = 'ELOBullet',
  BLITZ = 'ELOBlitz',
}

@Entity()
export class Classement {
  @PrimaryGeneratedColumn()
  idClassement: number;

  @OneToOne(() => Joueur, {nullable:false})
  @JoinColumn()
  idJoueur: Joueur;

  //Pour partie Rapide
  @Column({nullable:false})
  ELOMaxRapide: number;

  @Column({nullable:false})
  ELORapide: number;

  //Pour partie Bullet
  @Column({nullable:false})
  ELOMaxBullet: number;

  @Column({nullable:false})
  ELOBullet: number;

  //Pour partie Blitz
  @Column({nullable:false})
  ELOMaxBlitz: number;

  @Column({nullable:false})
  ELOBlitz: number;
}
