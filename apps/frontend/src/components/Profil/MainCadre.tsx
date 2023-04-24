import React, { useContext, useState, useEffect } from 'react';
import ModifContainer from './ModifContainer';
import { useNavigate } from 'react-router-dom';
import { UserContext, User } from '../UserContext';
import { Elo } from './EloContainer';
import ProfileImage from '../Logo_Icon/ProfileImage';
import axios from 'axios'
import { API_BASE_URL } from '../../config';
import Profil from '../../pages/Profil/Profil';


function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

interface Props {
  togglePopup() : void;
}

const MainCadre: React.FC<Props> = ({togglePopup}) => {

  const user = useContext(UserContext);
  const [eloData, setEloData] = useState<{ elo_blitz: number, elo_bullet: number, elo_rapide: number } | null>(null);
  const [dateInscription, setDateInscription] = useState<Date | null>(null);

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();


  const fetchEloData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/classement/elo`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setEloData(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données ELO:", error);
    }
  };

  const fetDataInscription = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/joueurs/dateInscription`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setDateInscription(new Date(response.data));
    } catch (error) {
      console.error("Erreur lors de la récupération des données de la date d'inscription:", error);
    }
  };


  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token === null) {
      //navigate('/');
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
          //navigate('/');
        });
    }
    fetchEloData();
    fetDataInscription();
  }, []);

  if (user.user === null || eloData === null) return null;
  return (
    <div className="MainCadre">
      <div>
        <ProfileImage id={0} />
        <div>
          <span>{user.user?.pseudo}</span>
          <div>
            <Elo elo={eloData.elo_bullet} svgType="bullet" />
            <Elo elo={eloData.elo_blitz} svgType="blitz" />
            <Elo elo={eloData.elo_rapide} svgType="rapide" />
          </div>
          <span>Membre depuis le {dateInscription ? formatDate(dateInscription) : "XX/XX/XXXX"}</span>
        </div>
      </div>
      <ModifContainer openPopUp={togglePopup}/>
    </div>
  );
};

export default MainCadre;
