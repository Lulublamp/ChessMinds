import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Joueur } from '../../joueurs/entities/joueur.entity';

@Entity()
export class Classement {
  @PrimaryColumn()
  idClassement: number;

  @Column()
  ELO: number;

  @ManyToOne(() => Joueur, (joueur) => joueur.idJoueur)
  idJoueur: number;
}
