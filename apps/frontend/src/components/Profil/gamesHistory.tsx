import React from 'react';
import './gamesHistory.css';

function PartieHistorique(props) {
    const { player1, player2, elo1, elo2, result, nbCoups, date } = props;

    let resultClass = "";
    //lié a une classe css pour afficher la couleur du résultat
    if (result === "V") {
        resultClass = "result-win";
    } else if (result === "D") {
        resultClass = "result-lose";
    }

    return (
        <div className="partie">
            <div className="fond"></div>
            <span className="player1">{player1} {elo1}</span>
            <span className="player2">{player2} {elo2}</span>
            <span className={`result ${resultClass}`}>{result}</span>
            <div className="button_replay">
                <div className="fond_button"></div>
                <span className="replay">Replay</span>
            </div>
            <span className="coups">{nbCoups}</span>
            <span className="date">{date}</span>
        </div>
    );
}

function trierPartiesParDate(parties) {
    parties.sort((partieA, partieB) => {
      const dateA = new Date(partieA.match_played_date);
      const dateB = new Date(partieB.match_played_date);
      return dateB - dateA;
    });
    return parties;
  }


function HistoriqueParties(props) {
    const { parties } = props;

    //trier les parties par date et ne garder que les 6 dernières
    const derniereParties = trierPartiesParDate(parties).slice(-6);

    return (
        <div className="historique-parties">
            {derniereParties.map((partie, index) => (
                <PartieHistorique
                    key={index}
                    player1={partie.username_player1}
                    player2={partie.username_player2}
                    elo1={partie.elo_player1_me}
                    elo2={partie.elo_player2}
                    result={partie.match_result}
                    nbCoups={partie.nb_coups}
                    date={partie.match_played_date}
                />
            ))}
        </div>
    );
}

function Historique(props) {
    const { parties } = props;
    // parties est un tableau d'objets, chaque objet représente une partie

    return (

        <div className="all_historique">

            <div className="parties_terminees_title">
                <div className="fond-title"></div>
                <div className="titre_histo">
                    <span className="parties_termin_es">Parties terminées</span>
                    <div className="vector">
                        <svg width="18" height="31" viewBox="0 0 18 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.01039 30.0467L0.494141 27.4366L12.1539 15.3416L0.494141 3.24664L3.01039 0.636475L17.1864 15.3416L3.01039 30.0467Z" fill="white"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="barre_historique">
                <div className="fond-barrehisto"></div>
                <div className="nom_elem">
                    <span className="regarder">Regarder</span>
                    <span className="r_sulat">Résulat</span>
                    <span className="coups">Coups</span>
                    <span className="date">Date</span>
                    <span className="joueurs">Joueurs</span>
                </div>
            </div>

            <HistoriqueParties parties={parties} />

        </div>
    );
}

export default Historique;


/* usage:

const parties = [
  {
    id: 1,
    username_player1: "Joueur 1",
    elo_player1_me: 1200,
    username_player2: "Joueur 2",
    elo_player2: 1100,
    match_result: "V",
    nb_coups: 35,
    match_played_date: "2022-03-23",
  },
  {
    id: 2,
    username_player1: "Joueur 3",
    elo_player1_me: 1300,
    username_player2: "Joueur 4",
    elo_player2: 1000,
    match_result: "D",
    nb_coups: 42,
    match_played_date: "2022-03-22",
  },
  {
    id: 3,
    username_player1: "Joueur 5",
    elo_player1_me: 1000,
    username_player2: "Joueur 6",
    elo_player2: 1500,
    match_result: "N",
    nb_coups: 60,
    match_played_date: "2022-03-24",
  },
  {
    id: 4,
    username_player1: "Joueur 7",
    elo_player1_me: 1100,
    username_player2: "Joueur 8",
    elo_player2: 1200,
    match_result: "D",
    nb_coups: 50,
    match_played_date: "2022-03-21",
  },
  {
    id: 5,
    username_player1: "Joueur 9",
    elo_player1_me: 1400,
    username_player2: "Joueur 10",
    elo_player2: 1300,
    match_result: "V",
    nb_coups: 28,
    match_played_date: "2022-03-20",
  },
  {
    id: 6,
    username_player1: "Joueur 11",
    elo_player1_me: 1150,
    username_player2: "Joueur 12",
    elo_player2: 1250,
    match_result: "V",
    nb_coups: 39,
    match_played_date: "2022-03-19",
  },
];

<Historique parties={parties} />

*/

