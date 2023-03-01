/* eslint-disable prettier/prettier */
import { type } from 'os';
import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rencontre } from '../../rencontre/entities/rencontre.entity';

enum Piece {
  PION = 'PION',
  CAVALIER = 'CAVALIER',
  FOU = 'FOU',
  TOUR = 'TOUR',
  DAME = 'DAME',
  ROI = 'ROI',
}
enum Echiquier {
  A1 = 11, A2 =12,  A3 = 13, A4 = 14, A5 = 15, A6 = 16, A7 = 17, A8 = 18,
  B1 = 21, B2 = 22, B3 = 23, B4 = 24, B5 = 25, B6 = 26, B7 = 27, B8 = 28,
  C1 = 31, C2 = 32, C3 = 33, C4 = 34, C5 = 35, C6 = 36, C7 = 37, C8 = 38,
  D1 = 41, D2 = 42, D3 = 43, D4 = 44, D5 = 45, D6 = 46, D7 = 47, D8 = 48,
  E1 = 51, E2 = 52, E3 = 53, E4 = 54, E5 = 55, E6 = 56, E7 = 57, E8 = 58,
  F1 = 61, F2 = 62, F3 = 63, F4 = 64, F5 = 65, F6 = 66, F7 = 67, F8 = 68,
  G1 = 71, G2 = 72, G3 = 73, G4 = 74, G5 = 75, G6 = 76, G7 = 77, G8 = 78,
  H1 = 81, H2 = 82, H3 = 83, H4 = 84, H5 = 85, H6 = 86, H7 = 87, H8 = 88,
}

@Entity()
export class Coups {
  @PrimaryGeneratedColumn()
  idCoup: number;

  @OneToOne(() => Rencontre)
  @JoinColumn()
  idRencontre: Rencontre;

  @Column({type:'enum', enum: Echiquier})
  caseSource: Echiquier;

  @Column({type:'enum', enum: Echiquier, nullable: false})
  caseDestination: Echiquier;

  @Column({ nullable: false })
  piece: Piece;
}
