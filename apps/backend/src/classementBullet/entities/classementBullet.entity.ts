/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Joueur } from '../../joueurs/entities/joueur.entity';

@Entity()
export class ClassementBullet {
  @PrimaryGeneratedColumn()
  idClassementBullet: number;

  @OneToOne(() => Joueur, {nullable:false})
  @JoinColumn()
  idJoueur: Joueur;

  @Column({nullable:false})
  ELOMax: number;

  @Column({nullable:false})
  ELO: number;
}
