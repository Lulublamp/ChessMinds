import React from 'react';
import "./Apprendre.css";
import ResultatPartie from '../../components/Apprendre/ResultatPartie';
import MouvementPieces from '../../components/Apprendre/MouvementPieces';
import DeroulementPartie from '../../components/Apprendre/DeroulementPartie';

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
                        <DeroulementPartie/>
                        <MouvementPieces/>
                        <ResultatPartie/>  
                    </div>
                </section>
            </main>
        </>
    );
}

export default Apprendre;



