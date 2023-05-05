import React, { useEffect, useState } from 'react';
import ProfileImage from '../Logo_Icon/ProfileImage';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { useNavigate } from 'react-router-dom';

interface FriendCardProps {
  idJoueur: number;
  defiMode : boolean;
  handleDefiClick?: (id: number) => void;
}

interface PlayerDetails {
  pseudo: string;
  eloMax: number;
  imageId: number;
}

const FriendCard: React.FC<FriendCardProps> = ({idJoueur, defiMode, handleDefiClick}) => {
  
  const [playerDetails, setPlayerDetails] = useState<PlayerDetails | null>(null);

  const navigate = useNavigate();

  const handleVoirProfil = () => {
    navigate(`/Profil?idPlayer=${idJoueur}`);
  };

  const handleDefi = () => {
    if(handleDefiClick) handleDefiClick(idJoueur);
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

  if(!playerDetails) return (<div>Loading..</div>);

  return (
    <div>
      <ProfileImage id={playerDetails.imageId} />
      <span>{playerDetails.pseudo}</span>
      <span>{playerDetails.eloMax}</span>
      {defiMode && <button onClick={handleDefi}>Défier</button>}
      {!defiMode && <button onClick={handleVoirProfil}>Voir profil</button>}
    </div>
  );
};

export default FriendCard;
