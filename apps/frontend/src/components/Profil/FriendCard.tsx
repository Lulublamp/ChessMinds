import React, { useEffect, useState } from 'react';
import ProfileImage from '../Logo_Icon/ProfileImage';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useNavigate } from 'react-router-dom';

interface FriendCardProps {
  idJoueur: number;
  defiMode: boolean;
  handleDefiClick?: (id: number) => void;
}

interface PlayerDetails {
  pseudo: string;
  eloMax: number;
  imageId: number;
}

const FriendCard: React.FC<FriendCardProps> = ({ idJoueur, defiMode, handleDefiClick }) => {

  const [playerDetails, setPlayerDetails] = useState<PlayerDetails | null>(null);

  const navigate = useNavigate();

  const handleVoirProfil = () => {
    navigate(`/Profil?idPlayer=${idJoueur}`);
  };

  const handleDefi = () => {
    if (handleDefiClick) handleDefiClick(idJoueur);
  };

  useEffect(() => {
    handleGetFriend();
  }, []);

  const handleGetFriend = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/joueurs/PlayerDetails/${idJoueur}`);
      const { pseudo, image, eloActuelle } = response.data;
      setPlayerDetails({
        pseudo,
        eloMax: Math.max(eloActuelle.blitz, eloActuelle.bullet, eloActuelle.rapide),
        imageId: image
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des informations du joueur", error);
    }
  };

  if (!playerDetails) return (<div>Loading..</div>);

  return (
    <div>
      <ProfileImage id={playerDetails.imageId} />
      <span>{playerDetails.pseudo}</span>
      <span>{playerDetails.eloMax}</span>
      {defiMode && <button onClick={handleDefi}>Défier</button>}
      {!defiMode && <button onClick={handleVoirProfil}>Voir profil</button>}
      <svg width="35" height="35" viewBox="0 0 35 35" fill="none">
        <path d="M20.4168 13.8542C20.4168 13.8542 21.146 15.3125 21.146 18.2292C21.146 21.1458 20.4168 22.6042 20.4168 22.6042M14.5835 13.8542C14.5835 13.8542 13.8543 15.3125 13.8543 18.2292C13.8543 21.1458 14.5835 22.6042 14.5835 22.6042M8.75015 8.75C8.75015 17.294 6.7538 29.1667 17.5002 29.1667C28.2465 29.1667 26.2501 17.294 26.2501 8.75M5.8335 8.75H29.1668M21.8752 8.75V7.29167C21.8752 4.70307 19.4874 4.375 17.5002 4.375C15.5129 4.375 13.1252 4.70307 13.1252 7.29167V8.75" stroke="#E63946" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

    </div>
  );
};

export default FriendCard;
