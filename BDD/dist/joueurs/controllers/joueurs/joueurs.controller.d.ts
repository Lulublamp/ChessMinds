import { CreateJoueursParam } from 'src/joueurs/dtos/CreateJoueurs.dto';
import { JoueursService } from 'src/joueurs/service/joueurs/joueurs.service';
export declare class JoueursController {
    private joueursService;
    constructor(joueursService: JoueursService);
    getCustomRepositoryToken(): void;
    createJoueur(createJoueurDto: CreateJoueursParam): void;
}
