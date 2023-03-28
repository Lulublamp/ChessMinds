import React from 'react';
import './profilStats.css';

//TODO refaire le css propre/nom classe

type StatisticsProps = {
    nbGames: number;
    nbWins: number;
    highestELO: number;
    blitz_elo: number;
    highest_blitz_elo: number;
    rapid_elo: number;
    highest_rapid_elo: number;
    bullet_elo: number;
    highest_bullet_elo: number;
  };

function Statistics({nbGames, nbWins, blitz_elo, highest_blitz_elo, rapid_elo, highest_rapid_elo, bullet_elo, highest_bullet_elo}: StatisticsProps) {
    
    const nbLosses = nbGames - nbWins;
    const totalGames = nbWins + nbLosses;
    const winRate = totalGames ? `${((nbWins / totalGames) * 100).toFixed(2)}%` : '0%';
    
    return (
        <div>
            
            <div className="background"></div>

            <div className="container">

                <span className="title">Statistiques</span>

                <div className="separateur">
                    <svg width="449" height="2" viewBox="0 0 449 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line y1="-0.5" x2="448" y2="-0.5" transform="matrix(1 0.00019499 -0.000151949 1 0.134766 1.54077)" stroke="white"/>
                    </svg>
                </div>

                <div className="all_stats">
                    <div className="gamesplayed">
                        <span>Parties</span>
                        <span>{nbGames}</span>
                    </div>
                    <div className="victories">
                        <span>Victoire</span>
                        <span>{nbWins}</span>
                    </div>
                    <div className="defaite">
                        <span>Défaite</span>
                        <span>{nbLosses}</span>
                    </div>
                    <div className="winrate">
                        <span>Win rate</span>
                        <span>{winRate}</span>
                    </div>

                </div>

                <div className="separateur">
                    <svg width="449" height="2" viewBox="0 0 449 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line y1="-0.5" x2="448" y2="-0.5" transform="matrix(1 0.00019499 -0.000151949 1 0.134766 1.4314)" stroke="white"/>
                    </svg>
                </div>

                <div className="elo-info">
                    
                    <div className="blitz-elo">
                        <span>Blitz ELO</span>
                        <span>{blitz_elo}</span>
                        <span>{highest_blitz_elo}</span>
                    </div>

                    <div className="rapid-elo">
                        <span>Rapid ELO</span>
                        <span>{rapid_elo}</span>
                        <span>{highest_rapid_elo}</span>
                    </div>

                    <div className="bullet-elo">
                        <span>Bullet ELO</span>
                        <span>{bullet_elo}</span>
                        <span>{highest_bullet_elo}</span>
                    </div>

                </div>
                
            </div>
            
        </div>
    );
}

export default Statistics;

/* usage:

    <div>
      <Statistics 
        nbGames={20}
        nbWins={12}
        blitz_elo={1500}
        highest_blitz_elo={1700}
        rapid_elo={1600}
        highest_rapid_elo={1800}
        bullet_elo={1400}
        highest_bullet_elo={1600}
      />
    </div>

*/
