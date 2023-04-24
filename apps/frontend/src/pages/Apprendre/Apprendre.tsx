import React from 'react';
import "./Apprendre.css";
import Logo from '../../components/Logo_Icon/Logo';
import MainMenu from '../../components/Navigation/MainMenu';
import SocialMedia from '../../components/Logo_Icon/SocialMedia';
import DownloadButton from '../../components/Button/DownloadButton';
import Navbar from "../../components/Navigation/NavBar";
import { useNavigate } from 'react-router-dom';

import MouvFou from '../../images/Mouvement_Pieces/mouv_fou.jpg';
import MouvTour from '../../images/Mouvement_Pieces/mouv_tour.jpg';
import MouvPion from '../../images/Mouvement_Pieces/mouv_pion.jpg';
import MouvCavalier from '../../images/Mouvement_Pieces/mouv_cavalier.jpg';
import MouvReine from '../../images/Mouvement_Pieces/mouv_reine.jpg';
import MouvRoi from '../../images/Mouvement_Pieces/mouv_roi.jpg';


const Apprendre = () => {  
    return (
        <>
            <main>
                <section className="PageApprendre">
                    <div>
                        <span>Vous êtes débutant ?</span>
                        <div>
                            <span>Pas de panique, voici les <span>règles du jeu</span>!</span>
                        </div>
                    </div>
                    <div>
                        <p> Les échecs sont un jeu de stratégie pour deux joueurs sur un plateau de 64 cases. </p>
                        <p> Le but du jeu est de mettre en échec et mat le roi de l'adversaire. </p>
                    </div>
                    <div>
                        <div>
                            <h2>Le déroulement de la partie</h2>
                            <div>
                                <div>
                                    <div>
                                        <h4>Le trait</h4>
                                        <p>Le joueur ayant les Blancs commence, puis chaque joueur effectue un coup à tour de rôle. 
                                            On dit du joueur qui doit jouer qu’il a le trait.</p>
                                    </div>
                                </div>
                                
                                <div>
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
                                
                                <div>
                                    <div>
                                        <h4>L’échec et mat</h4>
                                        <p> Si le joueur dont le roi est mis en échec n'a pas de solution pour parer la menace, il est 
                                            alors « échec et mat » et perd la partie.
                                        </p>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2>Le mouvement des pièces</h2>
                            <ul>
                                <li> Les bords de l'échiquier sont infranchissables par les pièces. </li>
                                <li> Les pièces se déplacent sur les cases vides du plateau en suivant des règles spécifiques.</li>
                                <li> Les pièces capturent les pièces adverses en se déplaçant sur leur case occupée.</li>
                            </ul>
                            
                            <div>
                                <div>
                                    <img src={MouvTour} alt="schéma des mouvements de la tour" />
                                    <div>
                                        <h4>La tour</h4>
                                        <p>La tour se déplace horizontalement et vertircalement sur le plateau, mais ne peut se déplacer en diagonale.</p>
                                    </div>
                                </div>
                                <div>
                                    <img src={MouvFou} alt="schéma des mouvements du fou" />
                                    <div>
                                        <h4>Le fou</h4>
                                        <p>Le fou se déplace uniquement en diagonale sur les cases de même couleur de sa case de commencement.</p>
                                    </div>
                                </div>
                                <div>
                                    <img src={MouvPion} alt="schéma des mouvements du pion" />
                                    <div>
                                        <h4>Le pion</h4>
                                        <p>Le pion avance d'une case vers l'avant, sauf lorsqu'il fait son premier mouvement, où il peut 
                                            avancer de deux cases. C’est la seule pièce ne pouvant pas reculer.
                                            Le pion ne peut capturer une pièce adverse que si elle se trouve à une case en diagonale de lui dans 
                                            son sens de déplacement.</p>
                                    </div>
                                </div>
                                <div>
                                    <img src={MouvCavalier} alt="schéma des mouvements du cavalier" />
                                    <div>
                                        <h4>Le cavalier</h4>
                                        <p>
                                            Le cavalier est la seule pièce qui ne se déplace pas en ligne et qui peut se 
                                            déplace entre les autres pièces, son mouvement forme un 'L' sur le plateau.
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <img src={MouvReine} alt="schéma des mouvements de la dame" />
                                    <div>
                                        <h4>La dame</h4>
                                        <p>La dame se déplace horizontalement, verticalement et en diagonale sur le plateau. 
                                            C’est la pièce la plus forte</p>
                                    </div>
                                </div>
                                <div>
                                    <img src={MouvRoi} alt="schéma des mouvements du roi" />
                                    <div>
                                        <h4>Le roi</h4>
                                        <p>Le roi se déplace d'une case dans toutes les directions. C’est la pièce la plus importante</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3>Mouvements spéciaux</h3>
                                <div>
                                    <div>
                                        <div>
                                            <h4>La promotion</h4>
                                            <p> Quand le pion arrive sur la dernière rangée, il doit se transformer en une pièce de son camp de 
                                                valeur supérieure : dame, tour, fou ou cavalier. On dit alors qu'il est « promu ».</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <h4>La pièce clouée</h4>
                                            <p> Une pièce est dite « clouée » lorsque son déplacement exposerait directement le roi de son camp 
                                                à un échec. Il est donc interdit de déplacer une pièce clouée.
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <h4>La prise en passant</h4>
                                            <p> Lorsqu’un pion situé sur sa rangée de départ avance de deux cases et se retrouve à côté d’un pion adverse, 
                                                alors l’adversaire peut, au coup suivant (et uniquement ce coup-là), prendre le pion qui vient d’avancer 
                                                avec son pion comme si le pion adverse n’avait avancé que d’une case.
                                            </p> 
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <h4>Le roque</h4>
                                            <p> Le roque est un coup spécial qui concerne le Roi et une des deux Tours. Lorsque le Roi et cette 
                                                Tour sont encore sur leurs cases initiales (n'ont jamais été déplacés) et qu’il n’y a plus de pièces entre eux, le joueur peut 
                                                déplacer de deux cases le Roi vers la Tour, puis placer cette Tour sur la case juste à côté du Roi, 
                                                de l’autre côté. 
                                            </p>
                                            <p> Le roque peut être effectué sur l’aile roi (on parle alors de petit roque) ou sur l’aile dame 
                                                (on parle alors de grand roque).
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>    
                        </div>
                        <div>
                            <h2>Le résultat de la partie</h2>
                            <div>
                                <p>Une partie d’échec peut avoir trois résultats: </p>
                                <ul>
                                    <li>le gain des Blancs</li>
                                    <li>le gain des Noirs</li>
                                    <li>un match nul</li>
                                </ul>
                                <div>
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
                    </div>
                </section>
            </main>
        </>
    );
}

export default Apprendre;



