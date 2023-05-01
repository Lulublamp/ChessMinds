import React, { useContext, useState, useEffect } from 'react';
import ModifContainer from './ModifContainer';
import { useNavigate } from 'react-router-dom';
import { UserContext, User } from '../UserContext';
import { Elo } from './EloContainer';
import ProfileImage from '../Logo_Icon/ProfileImage';
import axios from 'axios'
import { API_BASE_URL } from '../../config';
import Profil from '../../pages/Profil/Profil';
import { PlayerDetails } from '../../pages/Profil/Profil';

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

interface Props {
  togglePopup() : void;
  PlayerDetails: PlayerDetails;
}


const MainCadre: React.FC<Props> = ({togglePopup,PlayerDetails}) => {

  const user = useContext(UserContext);

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();


  if (!user.user || !PlayerDetails) return null;
  return (
    <div className="MainCadre">
      <div>
        <ProfileImage id={PlayerDetails.imageId} />
        <div>
          <span>{user.user?.pseudo}</span>
          <div>
            <Elo elo={PlayerDetails.elo_bullet} svgType="bullet" />
            <Elo elo={PlayerDetails.elo_blitz} svgType="blitz" />
            <Elo elo={PlayerDetails.elo_rapide} svgType="rapide" />
          </div>
          <span>Membre depuis le {PlayerDetails.dateInscription ? formatDate(PlayerDetails.dateInscription) : "XX/XX/XXXX"}</span>
        </div>
      </div>
      <ModifContainer openPopUp={togglePopup}/>
    </div>
  );
};

export default MainCadre;
