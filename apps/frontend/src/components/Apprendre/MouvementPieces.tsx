import React from 'react';
import ElementApprendre from './ElementApprendre';

import MouvFou from '../../images/Mouvement_Pieces/mouv_fou.jpg';
import MouvTour from '../../images/Mouvement_Pieces/mouv_tour.jpg';
import MouvPion from '../../images/Mouvement_Pieces/mouv_pion.jpg';
import MouvCavalier from '../../images/Mouvement_Pieces/mouv_cavalier.jpg';
import MouvReine from '../../images/Mouvement_Pieces/mouv_reine.jpg';
import MouvRoi from '../../images/Mouvement_Pieces/mouv_roi.jpg';

const MouvementPieces = () => {  
    return (
        <div>
            <h2>Le mouvement des pièces</h2>
            <ul>
                <li> Les bords de l'échiquier sont infranchissables par les pièces. </li>
                <li> Les pièces se déplacent sur les cases vides du plateau en suivant des règles spécifiques.</li>
                <li> Les pièces capturent les pièces adverses en se déplaçant sur leur case occupée.</li>
            </ul>
            
            <div>
                <ElementApprendre
                    avecImg={true}
                    id="Tour"
                    imgSrc={MouvTour}
                    imgAlt='schéma des mouvements de la tour'
                    Titre='La tour'
                    Text='La tour se déplace horizontalement et vertircalement sur le plateau, mais ne peut se déplacer en diagonale.'
                />
                <ElementApprendre
                    avecImg={true}
                    id="Fou"
                    imgSrc={MouvFou}
                    imgAlt='schéma des mouvements du fou'
                    Titre='Le fou'
                    Text='Le fou se déplace uniquement en diagonale sur les cases de même couleur de sa case de commencement.'
                />
                <ElementApprendre
                    avecImg={true}
                    id="Fou"
                    imgSrc={MouvPion}
                    imgAlt='schéma des mouvements du pion'
                    Titre='Le pion'
                    Text="Le pion avance d'une case vers l'avant, sauf lorsqu'il fait son premier mouvement, où il peut 
                                avancer de deux cases. C’est la seule pièce ne pouvant pas reculer."
                    Text2="Le pion ne peut capturer une pièce adverse que si elle se trouve à une case en diagonale de lui dans 
                    son sens de déplacement."
                />
                <ElementApprendre
                    avecImg={true}
                    id="Cavalier"
                    imgSrc={MouvCavalier}
                    imgAlt='schéma des mouvements du cavalier'
                    Titre='Le cavalier'
                    Text="Le cavalier est la seule pièce qui ne se déplace pas en ligne et qui peut se 
                                déplace entre les autres pièces, son mouvement forme un 'L' sur le plateau."
                />
                <ElementApprendre
                    avecImg={true}
                    id="Dame"
                    imgSrc={MouvReine}
                    imgAlt='schéma des mouvements de la dame'
                    Titre='La dame'
                    Text="La dame se déplace horizontalement, verticalement et en diagonale sur le plateau. "
                    Text2="C’est la pièce la plus forte"
                />
                <ElementApprendre
                    avecImg={true}
                    id="Roi"
                    imgSrc={MouvRoi}
                    imgAlt='schéma des mouvements du roi'
                    Titre='Le roi'
                    Text="Le roi se déplace d'une case dans toutes les directions. "
                    Text2="C’est la pièce la plus importante"
                />
            </div>
            <div>
                <h3>Mouvements spéciaux</h3>
                <div>
                    <ElementApprendre
                        avecImg={false}
                        id='Promotion'
                        Titre='La promotion'
                        Text="Quand le pion arrive sur la dernière rangée, il doit se transformer en une pièce de son camp de 
                                valeur supérieure : dame, tour, fou ou cavalier. "
                        Text2="On dit alors qu'il est « promu »."
                    />
                    <ElementApprendre
                        avecImg={false}
                        id='PieceClouee'
                        Titre='La pièce clouée'
                        Text="Une pièce est dite « clouée » lorsque son déplacement exposerait directement le roi de son camp 
                                à un échec. "
                        Text2='Il est donc interdit de déplacer une pièce clouée.'
                    />
                    <ElementApprendre
                        avecImg={false}
                        id='PrisePassant'
                        Titre='La prise en passant'
                        Text="Lorsqu’un pion situé sur sa rangée de départ avance de deux cases et se retrouve à côté d’un pion adverse, 
                                alors l’adversaire peut, au coup suivant (et uniquement ce coup-là), prendre le pion qui vient d’avancer 
                                avec son pion comme si le pion adverse n’avait avancé que d’une case."
                    />
                    <ElementApprendre
                        avecImg={false}
                        id='Roque'
                        Titre='Le roque'
                        Text="Le roque est un coup spécial qui concerne le Roi et une des deux Tours. Lorsque le Roi et cette 
                                Tour sont encore sur leurs cases initiales (n'ont jamais été déplacés) et qu’il n’y a plus de pièces entre eux, le joueur peut 
                                déplacer de deux cases le Roi vers la Tour, puis placer cette Tour sur la case juste à côté du Roi, 
                                de l’autre côté. "
                        Text2='Le roque peut être effectué sur l’aile roi (on parle alors de petit roque) ou sur l’aile dame 
                                (on parle alors de grand roque).'
                    />
                </div>
            </div>    
        </div>
    );
}

export default MouvementPieces;







