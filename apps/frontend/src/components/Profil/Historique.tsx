import React, { useContext, useState, useEffect } from 'react';
import GameHistoryRow from './GameHistoryRow';
import { UserContext } from '../UserContext';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const Historique: React.FC = () => {
  const [gameHistory, setGameHistory] = useState<any[] | null>(null);
  const user = useContext(UserContext);
  
  const fetchGameHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rencontre-coups/getDetailsParties`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setGameHistory(response.data);
      console.log(response.data);
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
          ? gameHistory.map((game) => <GameHistoryRow 
            elo1={game.joueurBlanc.elo.elo_bullet}
            elo2={game.joueurNoir.elo.elo_bullet}
            player1={game.joueurBlanc.pseudo}
            player2={game.joueurNoir.pseudo}
            result={game.resultat}
          />)
          : 'Chargement...'}
      </main>
    </div>
  );
};

export default Historique;