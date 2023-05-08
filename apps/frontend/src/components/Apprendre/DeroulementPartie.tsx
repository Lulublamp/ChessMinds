import React from 'react';
import ElementApprendre from './ElementApprendre';


const DeroulementPartie = () => {  
    return (
        <div>
            <h2>Le déroulement de la partie</h2>
            <div>
                <ElementApprendre
                    avecImg={false}
                    id='Trait'
                    Titre='Le trait'
                    Text='Le joueur ayant les Blancs commence, puis chaque joueur effectue un coup à tour de rôle. '
                    Text2='On dit du joueur qui doit jouer qu’il a le trait.'
                />
                <div id='Echec' className='Cadre'>
                    <div>
                        <h4>L’échec</h4>
                        <p> Lorsqu’un Roi est attaqué par une pièce adverse, on dit qu’il est en échec. Un joueur 
                            n’a pas le droit de laisser son Roi en échec. Il doit parer l’échec en : 
                        </p>
                            <ul>
                                <li>prenant la pièce qui attaque le Roi</li>
                                <li>déplaçant son Roi sur une case libre (non menacée)</li>
                                <li>interposant une pièce amis entre son Roi et l’attaquant</li>
                            </ul> 
                        <p> Tout autre coup est illégal.
                            Un joueur n’a pas le droit de déplacer son Roi sur une case où il serait en échec.
                        </p>
                    </div>
                </div>
                <ElementApprendre
                    avecImg={false}
                    id='EchecMat'
                    Titre='L’échec et mat'
                    Text="Si le joueur dont le roi est mis en échec n'a pas de solution pour parer la menace, il est 
                            alors « échec et mat » et perd la partie."
                />
            </div>
        </div>
    );
}

export default DeroulementPartie;







