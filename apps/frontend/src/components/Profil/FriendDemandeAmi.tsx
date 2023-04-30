import React, { useState, useEffect, useContext } from 'react';
import ProfileImage from '../Logo_Icon/ProfileImage';
import { useGlobalSocket } from '../../contexts/ContextPublicManager';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { UserContext } from '../UserContext';

interface FriendCardInvitationProps {
  idJoueur: number;
}

interface PlayerDetails {
  pseudo: string;
  eloMax: number;
  imageId: number;
}

const FriendCardInvitation: React.FC<FriendCardInvitationProps> = ({idJoueur}) => {
  const user = useContext(UserContext);
  const globalsocket = useGlobalSocket();
  const [playerDetails, setPlayerDetails] = useState<PlayerDetails | null>(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
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

    fetchPlayerDetails();
  }, [idJoueur]);

  const acceptFriendRequest = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/joueurs/friends/add`,
        { joueurId: user.user?.id, friendId : idJoueur },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log("Demande d'ami acceptée");
      globalsocket?.processInvitation({idInvite :idJoueur})
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la demande d'ami", error);
    }
  };
  

  const declineFriendRequest = async () => {
    console.log("Demande d'ami refusée");
    globalsocket?.processInvitation({idInvite :idJoueur})
  };

  if (!playerDetails) {
    return <div>Loading...</div>; // or some loading spinner
  }

  return (
    <div>
      <ProfileImage id={playerDetails.imageId} />
      <span>{playerDetails.pseudo}</span>
      <span>{playerDetails.eloMax}</span>
      <button onClick={acceptFriendRequest}>Accepter</button>
      <button onClick={declineFriendRequest}>Refuser</button>
    </div>
  );
};

export default FriendCardInvitation;
