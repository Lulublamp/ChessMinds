import React, { useContext, useState, useEffect } from 'react';
import GameHistoryRow from './GameHistoryRow';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const Historique: React.FC = () => {

  type GameHistory = {
    elo1: number;
    elo2: number;
    player1: string;
    player2: string;
    result: string;
    date: string;
    nbr_coups: number;
    id_rencontre: number;
  };

  const [gameHistory, setGameHistory] = useState<GameHistory[] | null>(null);
  
  const fetchGameHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rencontre-coups/getDetailsParties`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      //console.log('Historique des parties récupéré avec succès:', response.data);
      // map response data to match GameHistory type
      const mappedData = response.data.map((game: any) => {
        const date = new Date(game.partie.datePartie);
      
        return {
          elo1: game.partie.eloBlanc,
          elo2: game.partie.eloNoir,
          player1: game.joueurBlanc.pseudo,
          player2: game.joueurNoir.pseudo,
          result: game.vainqueur.toString(),
          date: date.toLocaleDateString('fr-FR'),  // format the date as 'DD/MM/YYYY'
          nbr_coups: game.coups.length,
          id_rencontre: game.idRencontre,
        };
      });

      setGameHistory(mappedData); // Set game history state


    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique des parties:', error);
    }
  };

  useEffect(() => {
    fetchGameHistory();
  }, []);

  return (
    <div className="Historique">
      <header>
        <div>
          <span>Parties terminées</span>
        </div>
        <div>
          <span>Joueurs</span>
          <span>Résulat</span>
          <span>Regarder</span>
          <span>Coups</span>
          <span>Date</span>
        </div>
      </header>
      <main>
        {gameHistory
          ? gameHistory.map((game,index) => <GameHistoryRow 
            key={index}
            elo1={game.elo1}
            elo2={game.elo2}
            player1={game.player1}
            player2={game.player2}
            result={game.result}
            date={game.date}
            nbr_coups={game.nbr_coups}
            id_rencontre={game.id_rencontre}
          />)
          : 'Chargement...'}
      </main>
    </div>
  );
};

export default Historique;