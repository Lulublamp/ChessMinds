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
import { useNavigate } from 'react-router-dom';

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


const Profil: React.FC<ProfilProps> = ({lstIdInvitations}) => {

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [PlayerDetails, setPlayerDetails] = useState<PlayerDetails>();
  const user = useContext(UserContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const getInfoPlayer = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/joueurs/PlayerDetails/${user.user?.id}`);
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
    if(user.user) {
      getInfoPlayer();
    }
  }, [user.user]);

  if(!PlayerDetails) {
    return <div>Chargement...</div>
  }

  return (
    <>
      <section className="Profil">
        <div className="leftContainer">
          <MainCadre togglePopup={togglePopup} PlayerDetails={PlayerDetails}/>
          <Historique />
        </div>
        <div className="rightContainer">
          <Statistiques />
          <FriendsList lstIdInvitations={lstIdInvitations} defiMode={false}/>
        </div>
      </section>
      {isPopupOpen && <PopupModifProfil togglePopup={togglePopup} iconId={PlayerDetails.imageId} handleUpdateIconId={handleUpdateIconId}/>}
    </>
  );
};

export default Profil;
