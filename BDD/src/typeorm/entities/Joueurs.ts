import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({name: "joueurs"})

export class Joueurs{   
    @PrimaryGeneratedColumn()
    idJoeur: number;

    @Column()
    pseudo: string;

    @Column()
    tagJoueur: number;

    @Column({unique: true})
    loginJoueur: string;

    @Column({nullable: false})
    motDePass: string;

    @Column({nullable: false})
    adresseMail: string;

    @Column({default: new Date()})
    dateInscription: Date;
}