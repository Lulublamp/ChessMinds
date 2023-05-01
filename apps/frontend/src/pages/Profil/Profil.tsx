import React, { useContext, useEffect, useState } from 'react';
import MainCadre from '../../components/Profil/MainCadre';
import Historique from '../../components/Profil/Historique';
import Statistiques from '../../components/Profil/Statistique';
import FriendsList from '../../components/Profil/FriendsList';
import PopupModifProfil from '../../components/Profil/PopupModifProfil';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import './styleProfil.css';
import { UserContext, User } from '../../components/UserContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

interface ProfilProps {
  lstIdInvitations: number[];
}

export interface PlayerDetails {
  pseudo: string;
  elo_bullet: number;
  elo_blitz: number;
  elo_rapide: number;
  imageId: number;
  dateInscription: Date;
}

const Profil: React.FC<ProfilProps> = ({ lstIdInvitations }) => {

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [PlayerDetails, setPlayerDetails] = useState<PlayerDetails>();
  const user = useContext(UserContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const idPlayer = query.get('idPlayer');

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const getInfoPlayer = async (id: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/joueurs/PlayerDetails/${id}`);
      setPlayerDetails({
        pseudo: response.data.pseudo,
        elo_bullet: response.data.eloActuelle.bullet,
        elo_blitz: response.data.eloActuelle.blitz,
        elo_rapide: response.data.eloActuelle.rapide,
        imageId: response.data.image,
        dateInscription: new Date(response.data.dateInscription)
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des données ELO:", error);
    }
  };

  const handleUpdateIconId = (iconId: number) => {
    setPlayerDetails({
      ...PlayerDetails!,
      imageId: iconId
    });
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
    const token = localStorage.getItem('accessToken');
    if (token === null) {
      navigate('/');
    } else if (user.user === null || user.user === undefined) {
      axios
        .get(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser({
            id: response.data.idJoueur,
            email: response.data.adresseMail,
            pseudo: response.data.pseudo,
          });
        })
        .catch((error) => {
          console.log(error);
          localStorage.removeItem('accessToken');
          navigate('/');
        });
    }
  }, []);

  useEffect(() => {
    const checkFriendshipAndFetchInfo = async () => {
      if (user.user) {
        if (idPlayer) {
          const isFriend = await checkIfisFriends(Number(idPlayer));
          if (isFriend) {
            getInfoPlayer(idPlayer);
          }
        } else {
          getInfoPlayer(user.user.id);
        }
      }
    }
    checkFriendshipAndFetchInfo();
  }, [user.user, idPlayer, location]);

  if (!PlayerDetails) {
    return <div>Chargement...</div>
  }

  return (
    <>
      <section className="Profil">
        <div className="leftContainer">
          <MainCadre togglePopup={togglePopup} PlayerDetails={PlayerDetails} />
          <Historique />
        </div>
        <div className="rightContainer">
          <Statistiques />
          {user.user?.pseudo === PlayerDetails.pseudo && <FriendsList lstIdInvitations={lstIdInvitations} defiMode={false} />}
        </div>
      </section>
      {isPopupOpen && <PopupModifProfil togglePopup={togglePopup} iconId={PlayerDetails.imageId} handleUpdateIconId={handleUpdateIconId} />}
    </>
  );
};

export default Profil;
