import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Joueur } from '../../joueurs/entities/joueur.entity';

@Entity()
export class Rencontre {
  @PrimaryGeneratedColumn()
  idRencontre: number;

  @ManyToOne(() => Joueur, (joueur) => joueur.idJoueur)
  joueurBlanc: number;

  @Column()
  joueurNoir: number;

  @Column()
  vainqueur: number;
}
