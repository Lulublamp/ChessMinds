import React, { useState } from 'react';
import MainCadre from '../../components/Profil/MainCadre';
import Historique from '../../components/Profil/Historique';
import Statistiques from '../../components/Profil/Statistique';
import FriendsList from '../../components/Profil/FriendsList';
import PopupModifProfil from '../../components/Profil/PopupModifProfil';
import './styleProfil.css';

interface ProfilProps {
  lstIdInvitations: number[];
}

const Profil: React.FC<ProfilProps> = ({lstIdInvitations}) => {

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };


  return (
    <>
      <section className="Profil">
        <div className="leftContainer">
          <MainCadre togglePopup={togglePopup} />
          <Historique />
        </div>
        <div className="rightContainer">
          <Statistiques />
          <FriendsList lstIdInvitations={lstIdInvitations} />
        </div>
      </section>
      {isPopupOpen && <PopupModifProfil togglePopup={togglePopup}/>}
    </>
  );
};

export default Profil;
