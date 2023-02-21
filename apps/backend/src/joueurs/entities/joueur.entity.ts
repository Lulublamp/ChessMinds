/* eslint-disable prettier/prettier */
import { Rencontre } from "src/rencontre/entities/rencontre.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Joueur {

  @PrimaryGeneratedColumn()
  @OneToMany(() => Rencontre, (rencontre) => rencontre.joueurBlanc)
  @OneToMany(() => Rencontre, (rencontre) => rencontre.joueurNoir)
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