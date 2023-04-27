import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onLogoutClick: () => void;
  onNewGameClick: () => void;
  onPrivateGameClick: () => void;
}

const MenuContainer: React.FC<Props> = ({onLogoutClick,onNewGameClick, onPrivateGameClick }) => {
  
  const navigate = useNavigate();

  const goToProfil = () => {
    navigate('/Profil');
  };

  return (
    <div className="menu-container">
      <button onClick={onNewGameClick}>🕹️ Nouvelle partie</button>
      <button>🤖 VS l’ordinateur</button>
      <button onClick={onPrivateGameClick}>🤝 Défier un ami</button>
      <button>🎓 Apprendre</button>
      <button onClick={goToProfil}>🏆 Mon profil</button>
      <button onClick={onLogoutClick}>Déconnexion</button>
    </div>
  );
};

export default MenuContainer;