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
        <div>
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
                            <h2>Règles de base</h2>
                            <p>
                                Les blancs commencent la partie en jouant un coup.
                                Les pièces se déplacent sur les cases vides du plateau en suivant des règles spécifiques.
                                Les pièces capturent les pièces adverses en se déplaçant sur leur case occupée.
                                Le jeu se termine lorsque le roi de l'un des joueurs est en échec et mat ou lorsque les joueurs conviennent d'un match nul.
                            </p>
                        </div>
                        <div>
                            <h2>Le mouvement des pièces</h2>
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
                                        <p>Le pion avance d'une case vers l'avant, sauf lorsqu'il fait son premier mouvement, où il peut avancer de deux cases.
                                            C’est la seule pièce ne pouvant pas reculer</p>
                                    </div>
                                </div>
                                <div>
                                    <img src={MouvCavalier} alt="schéma des mouvements du cavalier" />
                                    <div>
                                        <h4>Le cavalier</h4>
                                        <p>Le cavalier est la seule pièce qui ne se déplace pas en ligne, mais en L sur le plateau.</p>
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
                                            <p> Lorsqu’un pion atteint la dernière rangée, il doit être remplacé par une Dame, une Tour, 
                                                un Fou ou un Cavalier, de la même couleur quelles que soient les pièces restantes sur l’échiquier.</p>
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
                                                Tour sont encore sur leurs cases initiales et qu’il n’y a plus de pièces entre eux, le joueur peut 
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
                    </div>
                </section>
            </main>
        </div>

    );
}

export default Apprendre;



