import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onLogoutClick: () => void;
  onNewGameClick: () => void;
  onPrivateGameClick: () => void;
  onAiGameClick: () => void;
}

const MenuContainer: React.FC<Props> = ({onLogoutClick,onNewGameClick, onPrivateGameClick,onAiGameClick }) => {
  
  const navigate = useNavigate();

  const goToProfil = () => {
    navigate('/Profil');
  };

  const goToLearn = () => {
    navigate('/Apprendre');
  };

  return (
    <div className="menu-container">
      <button onClick={onNewGameClick}>🕹️ Nouvelle partie</button>
      <button onClick={onAiGameClick}>🤖 VS l’ordinateur</button>
      <button onClick={onPrivateGameClick}>🤝 Défier un ami</button>
      <button onClick={goToLearn}>🎓 Apprendre</button>
      <button onClick={goToProfil}>🏆 Mon profil</button>
      <button onClick={onLogoutClick}>Déconnexion</button>
    </div>
  );
};

export default MenuContainer;