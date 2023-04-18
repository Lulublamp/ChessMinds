import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const Statistiques: React.FC = () => {

  const [stats, setStats] = useState<{ victoires: number; defaites: number; parties: number } | null>(null);
  const [HighesteloData, setEloData] = useState<number | null>(null);

  const fetchStats = async () => {
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

  useEffect(() => {
    fetchStats();
    fetchHighestEloData();
  }, [])

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
