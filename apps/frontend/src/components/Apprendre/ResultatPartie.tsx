import React from 'react';

const ResultatPartie = () => {  
    return (
        <div>
            <h2>Le résultat de la partie</h2>
            <div>
                <p>Une partie d’échec peut avoir trois résultats: </p>
                <ul>
                    <li>le gain des Blancs</li>
                    <li>le gain des Noirs</li>
                    <li>un match nul</li>
                </ul>
                <div className='Cadre'>
                    <div>
                        <h4>Parties nulles</h4>
                        <div> 
                            <p> La partie est dite « nulle », c'est-à-dire sans vainqueur, si l'une de ces conditions survient :</p>
                            <ul>
                                <li>si l’un des joueurs n’a aucun coup légal mais que son Roi n’est pas en échec. On dit que ce joueur est pat.</li>
                                <li>il n'y a de possibilité pour aucun des deux camps de mettre échec et mat le camp adverse 
                                    par manque de pièces ou parce qu'il n'existe aucune suite de coups qui puisse conduire à 
                                    un mat ;
                                </li>
                                <li>si les deux joueurs ont joué chacun 50 coups consécutifs sans poussée de pion ni prise de pièce</li>
                                <li>si la même position survient trois fois sur l’échiquier, consécutives ou non (deux 
                                    positions sont identiques si le trait est le même et si les possibilités de prise en passant 
                                    et de roque sont les mêmes) ;
                                </li>
                                <li>par accord mutuel entre les deux joueurs ;</li>
                                <li>si un joueur perd au temps et que son adversaire n'a pas le matériel suffisant pour mater 
                                    son adversaire, quelle que soit la suite de coups choisie.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResultatPartie;







