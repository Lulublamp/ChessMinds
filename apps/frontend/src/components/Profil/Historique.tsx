import React, { useContext, useState, useEffect } from 'react';
import GameHistoryRow from './GameHistoryRow';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../UserContext';

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
  const user = useContext(UserContext);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const idPlayer = query.get('idPlayer');
  const [playerpseudo, setPlayerpseudo] = useState<string>("");
  
  const fetchGameHistory = async (idJoueur?: number) => {
    if (!idJoueur) {
      try {
        const response = await axios.get(`${API_BASE_URL}/rencontre-coups/getDetailsParties`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const mappedData = mapGameData(response.data);
        setGameHistory(mappedData);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique des parties:', error);
      }
    }
    else {
      try {
        const response = await axios.get(`${API_BASE_URL}/rencontre-coups/getDetailsPartiesFriend/${idJoueur}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const mappedData = mapGameData(response.data);
        setGameHistory(mappedData);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique des parties de l\'ami:', error);
      }
    }
  };

  const mapGameData = (data: any[]) => {
    return data.map((game: any) => {
      const date = new Date(game.partie.datePartie);
      if(idPlayer){
        if(idPlayer === game.joueurBlanc.idJoueur.toString()){
          setPlayerpseudo(game.joueurBlanc.pseudo);
        }
        else{
          setPlayerpseudo(game.joueurNoir.pseudo);
        } 
      }
      else{
        if(user.user)
          setPlayerpseudo(user.user?.pseudo);
      }
      return {
        elo1: game.partie.eloBlanc,
        elo2: game.partie.eloNoir,
        player1: game.joueurBlanc.pseudo,
        player2: game.joueurNoir.pseudo,
        result: game.vainqueur.toString(),
        date: date.toLocaleDateString('fr-FR'),
        nbr_coups: game.coups.length,
        id_rencontre: game.idRencontre,
      };
    });
  }

  const checkIfisFriends = async (friendId: number): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/joueurs/friends/${friendId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    async function GameHistory() {
      if (user.user) {
        if (idPlayer) {
          const isFriend = await checkIfisFriends(Number(idPlayer));
          if (isFriend) {
            fetchGameHistory(Number(idPlayer));
          }
        } else {
          fetchGameHistory();
        }
      }
    }
    GameHistory();
  }, [user.user, idPlayer, location]);


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
          ? gameHistory.map((game, index) => <GameHistoryRow
            key={index}
            elo1={game.elo1}
            elo2={game.elo2}
            player1={game.player1}
            player2={game.player2}
            result={game.result}
            date={game.date}
            nbr_coups={game.nbr_coups}
            id_rencontre={game.id_rencontre}
            playerpseudo={playerpseudo}
          />)
          : 'Chargement...'}
      </main>
    </div>
  );
};

export default Historique;