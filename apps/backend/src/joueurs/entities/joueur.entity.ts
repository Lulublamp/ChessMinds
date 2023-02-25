/* eslint-disable prettier/prettier */
import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  PrimaryGeneratedColumn 
} from "typeorm";

@Entity()
export class Joueur {

  @PrimaryGeneratedColumn()
  idJoueur: number;

  @Column({nullable: false})
  adresseMail: string;

  @Column()
  pseudo: string;

  @Column({nullable:false})
  tagJoueur: string;

  @Column({nullable:false})
  loginJoueur: string;

  @Column({nullable:false})
  motDePasse: string;

  @CreateDateColumn()
  dateInscription: Date;
}