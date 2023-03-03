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

  @CreateDateColumn({nullable:false})
  dateInscription: Date;

  @ManyToMany(() => Joueur)
  amis: Joueur[];

}