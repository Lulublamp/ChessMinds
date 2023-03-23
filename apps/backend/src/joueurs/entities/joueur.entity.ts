/* eslint-disable prettier/prettier */
import { 
  BeforeInsert,
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
  fullpseudo: string;

  @Column({nullable:false})
  motDePasse: string;

<<<<<<< apps/backend/src/joueurs/entities/joueur.entity.ts
  @CreateDateColumn()
=======
  @CreateDateColumn({nullable:false})
>>>>>>> apps/backend/src/joueurs/entities/joueur.entity.ts
  dateInscription: Date;

  @ManyToMany(() => Joueur)
  amis: Joueur[];

  @BeforeInsert()
  generateTagJoueur() {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    this.tagJoueur = `#${randomNumber}`;
  }
  @BeforeInsert()
  setFullName() {
    this.fullpseudo = `${this.pseudo} ${this.tagJoueur}`;
  }
}