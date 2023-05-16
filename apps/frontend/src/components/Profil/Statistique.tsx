import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { UserContext } from '../UserContext';
import { useLocation } from 'react-router-dom';


const Statistiques: React.FC = () => {

  const [stats, setStats] = useState<{ victoires: number; defaites: number; parties: number } | null>(null);
  const [HighesteloData, setEloData] = useState<number | null>(null);
  const user = useContext(UserContext);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const idPlayer = query.get('idPlayer');

  const fetchStats = async (idJoueur? : number) => {
    if(!idJoueur){
      try {
        const response = await axios.get(`${API_BASE_URL}/rencontre-coups/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    }
    else{
      try {
        const response = await axios.get(`${API_BASE_URL}/rencontre-coups/statsFriend/${idJoueur}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques de l\'ami:', error);
      }
    }
  };
  
  const fetchHighestEloData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/classement/myHighestElo?typePartie=${'elo_bullet'}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setEloData(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données ELO:", error);
    }
  };

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
    const checkFriendshipAndFetchInfo = async () => {
      if (user.user) {
        if (idPlayer) {
          const isFriend = await checkIfisFriends(Number(idPlayer));
          if (isFriend) {
            fetchStats(Number(idPlayer));
            console.log('isFriend');
          }
        } else {
          fetchStats();
          fetchHighestEloData();
        }
      }
    }
    checkFriendshipAndFetchInfo();
  }, [user.user, idPlayer, location])

  const winRate = stats ? (stats.victoires / stats.parties) * 100 : 0;

  return (
    <div className="Statistiques">
      <span>Statistiques</span>
      <div>
        <div>
          <span>Parties</span>
          <span>{stats ? stats.parties : 'XX'}</span>
        </div>
        <div>
          <span>Victoires</span>
          <span>{stats ? stats.victoires : 'XX'}</span>
        </div>
        <div>
          <span>Défaites</span>
          <span>{stats ? stats.defaites : 'XX'}</span>
        </div>
        <div>
          <span>Win rate</span>
          <span>{stats ? `${winRate.toFixed(2)}%` : 'XX'}</span>
        </div>
      </div>
      <div>
        <span>Highest ELO</span>
        <span>{HighesteloData ? HighesteloData : 'XX'}</span>
      </div>
    </div>
  );
};

export default Statistiques;
