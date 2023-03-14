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
export class ClassementBlitz {
  @PrimaryGeneratedColumn()
  idClassementBlitz: number;

  @OneToOne(() => Joueur, {nullable:false})
  @JoinColumn()
  idJoueur: Joueur;

  //Attribut qui permettra de stocker le ELO le plus eleve du joeur (son score max)
  @Column({nullable:false})
  ELOMax: number;

  @Column({nullable:false})
  ELO: number;
}
