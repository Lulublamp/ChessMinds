/* eslint-disable prettier/prettier */
import { 
  BeforeInsert,
  Column, 
  CreateDateColumn, 
  Entity, 
  JoinTable, 
  ManyToMany, 
  OneToOne, 
  PrimaryGeneratedColumn 
} from "typeorm";
import { JoueurDto } from "../DTO/joueurs.dto";
import { Classement } from "src/classement/entities/classement.entity";

@Entity()
export class Joueur {

  @PrimaryGeneratedColumn()
  idJoueur: number;

  @Column({nullable: false , unique: true})
  adresseMail: string;

  @Column({nullable:false})
  pseudo: string;
  
  @Column({nullable:false})
  motDePasse: string;

  @CreateDateColumn()
  dateInscription: Date;

  @Column({nullable: false , default: 0})
  image: number;

  @ManyToMany(() => Joueur , (user) => user.amis)
  @JoinTable()
  amis: Joueur[]; 

  toDto(): JoueurDto {
    const dto = new JoueurDto();
    dto.idJoueur = this.idJoueur;
    dto.adresseMail = this.adresseMail;
    dto.pseudo = this.pseudo;
    return dto;
  }

}