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
  A1 = 'A1',A2 = 'A2',A3 = 'A3',A4 = 'A4',A5 = 'A5',A6 = 'A6',A7 = 'A7',A8 = 'A8',
  B1 = 'B1',B2 = 'B2',B3 = 'B3',B4 = 'B4',B5 = 'B5',B6 = 'B6',B7 = 'B7',B8 = 'B8',
  C1 = 'C1',C2 = 'C2',C3 = 'C3',C4 = 'C4',C5 = 'C5',C6 = 'C6',C7 = 'C7',C8 = 'C8',
  D1 = 'D1',D2 = 'D2',D3 = 'D3',D4 = 'D4',D5 = 'D5',D6 = 'D6',D7 = 'D7',D8 = 'D8',
  E1 = 'E1',E2 = 'E2',E3 = 'E3',E4 = 'E4',E5 = 'E5',E6 = 'E6',E7 = 'E7',E8 = 'E8',
  F1 = 'F1',F2 = 'F2',F3 = 'F3',F4 = 'F4',F5 = 'F5',F6 = 'F6',F7 = 'F7',F8 = 'F8',
  G1 = 'G1',G2 = 'G2',G3 = 'G3',G4 = 'G4',G5 = 'G5',G6 = 'G6',G7 = 'G7',G8 = 'G8',
  H1 = 'H1',H2 = 'H2',H3 = 'H3',H4 = 'H4',H5 = 'H5',H6 = 'H6',H7 = 'H7',H8 = 'H8',
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

  @Column()
  caseDestination: Echiquier;

  @Column()
  piece: Piece;
}
