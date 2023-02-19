import { CreateJoueursParam } from 'src/joueurs/dtos/CreateJoueurs.dto';
import { Joueurs } from 'src/typeorm/entities/Joueurs';
import { Repository } from 'typeorm';
export declare class JoueursService {
    private joueursRepository;
    constructor(joueursRepository: Repository<Joueurs>);
    findJoueurs(): void;
    createJoueur(userDetails: CreateJoueursParam): Promise<Joueurs>;
}
