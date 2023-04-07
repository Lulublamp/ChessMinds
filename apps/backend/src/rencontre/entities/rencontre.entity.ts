/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Joueur } from '../../joueurs/entities/joueur.entity';

@Entity()
export class Rencontre {
  @PrimaryGeneratedColumn()
  idRencontre: number;

  @ManyToOne(() => Joueur,{nullable:false})
  @JoinColumn()
  joueurBlanc: Joueur;

  @ManyToOne(() => Joueur, {nullable:false})
  @JoinColumn()
  joueurNoir: Joueur;

  @Column({nullable:false})
  vainqueur: number;
  

  /*@Column({nullable:false})
  matchNul: boolean;*/

}
