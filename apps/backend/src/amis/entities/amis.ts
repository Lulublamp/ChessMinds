/* eslint-disable prettier/prettier */
import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  PrimaryGeneratedColumn 
} from "typeorm";

@Entity()
export class Amis {
  @PrimaryGeneratedColumn()
  idAmis: number;

  @Column({nullable: false})
  idJoueur1: number;

  @Column({nullable: false})
  idJoueur2: number;

  @CreateDateColumn()
  dateDemande: Date;
}