/* eslint-disable prettier/prettier */
import { 
  BeforeInsert,
  Column, 
  CreateDateColumn, 
  Entity, 
  JoinTable, 
  ManyToMany, 
  PrimaryGeneratedColumn 
} from "typeorm";

@Entity()
export class Joueur {

  @PrimaryGeneratedColumn()
  idJoueur: number;

  @Column({nullable: false , unique: true})
  adresseMail: string;

  @Column({nullable:false})
  pseudo: string;

  @Column({nullable:false})
  tagJoueur: string;

  @Column({nullable:false})
  fullpseudo: string;

  @Column({nullable:false})
  motDePasse: string;

  @CreateDateColumn()
  dateInscription: Date;

  @ManyToMany(() => Joueur , (user) => user.amis )
  @JoinTable()
  amis: Joueur[]; 
}