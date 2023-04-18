import React from 'react';
import MainCadre from '../../components/Profil/MainCadre';
import Historique from '../../components/Profil/Historique';
import Statistiques from '../../components/Profil/Statistique';
import FriendsList from '../../components/Profil/FriendsList';
import './styleProfil.css';

const Profil: React.FC = () => {
  return (
    <section className="Profil">
      <div className="leftContainer">
        <MainCadre />
        <Historique />
      </div>
      <div className="rightContainer">
        <Statistiques />
        <FriendsList />
      </div>
    </section>
  );
};

export default Profil;
