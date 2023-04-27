/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Joueur } from '../../joueurs/entities/joueur.entity';
import { Partie } from 'src/partie/entities/partie.entity';
import { Coups } from 'src/coups/entities/coups.entity';

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

  @OneToOne(() => Partie, partie => partie.rencontre)
  partie: Partie;

  @OneToMany(() => Coups, coup => coup.idRencontre)
  coups: Coups[];
}
