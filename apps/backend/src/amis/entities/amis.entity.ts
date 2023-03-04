/* eslint-disable prettier/prettier */
import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  ManyToOne, 
  PrimaryGeneratedColumn,
  JoinColumn
} from "typeorm";
import { Joueur } from '../../joueurs/entities/joueur.entity';

@Entity()
export class Amis {
  @PrimaryGeneratedColumn()
  idAmis: number;


  @ManyToOne(()=>Joueur,{nullable:false})
  @JoinColumn()
  idJoueur1: Joueur;

  @ManyToOne(()=>Joueur,{nullable:false})
  @JoinColumn()
  idJoueur2: Joueur;

  @CreateDateColumn()
  dateDemande: Date;
}
