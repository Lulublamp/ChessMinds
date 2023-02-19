import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Joueur {

  @PrimaryGeneratedColumn()
  idJoueur: number;

  @Column()
  adresseMail: string;

  @Column()
  pseudo: string;

  @Column()
  tagJoueur: string;

  @Column()
  loginJoueur: string;

  @Column()
  motDePasse: string;

  @CreateDateColumn()
  dateInscription: Date;
  
}