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

  @ManyToOne(() => Joueur)
  @JoinColumn()
  joueurBlanc: Joueur;

  @ManyToOne(() => Joueur)
  @JoinColumn()
  joueurNoir: Joueur;

  @Column()
  vainqueur: number;
}
