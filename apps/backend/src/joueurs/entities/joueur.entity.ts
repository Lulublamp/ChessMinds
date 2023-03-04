/* eslint-disable prettier/prettier */
import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  ManyToMany, 
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
  motDePasse: string;

<<<<<<< apps/backend/src/joueurs/entities/joueur.entity.ts
  @CreateDateColumn({nullable:false})
=======
  @CreateDateColumn()
>>>>>>> apps/backend/src/joueurs/entities/joueur.entity.ts
  dateInscription: Date;

  @ManyToMany(() => Joueur)
  amis: Joueur[];

}