import React, { useState } from 'react';

interface Props {
  onPlayClick: () => void;
  goClassementPage: () => void;
  goApprendrePage: () => void;
  toggleDarkModeClick: (event: React.MouseEvent) => void;
  onLogoutClick: () => void;
}

const HamburgerMenu: React.FC<Props> = ({ onPlayClick, goClassementPage, toggleDarkModeClick, goApprendrePage, onLogoutClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const menuStyle = {
    left: menuOpen ? '0px' : '-100%',
  };

  return (
    <>
      <div className="hamburger" onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <div className="menu" style={menuStyle}>
        <div className="close-btn-container">
          <svg onClick={toggleMenu} className="close-btn" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="#212121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6L18 18" stroke="#212121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="play-btn" onClick={onPlayClick}>
          Jouer
        </span>
        <span onClick={goApprendrePage}>Apprendre</span>
        <span onClick={goClassementPage}>Classement</span>
        <button type="button" onClick={toggleDarkModeClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4.67199 18.7967C3.97348 18.2328 4.55832 17.2239 5.45256 17.1452C11.2419 16.6357 15.0596 10.0755 12.4592 5.00063C12.0486 4.19926 12.5832 3.13003 13.4466 3.38559C17.2438 4.50955 20 7.94173 20 12C20 16.9715 16.1189 21 11 21C8.65964 21 6.38082 20.1762 4.67199 18.7967Z" stroke="#001A72" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span onClick={onLogoutClick}>Déconnexion</span>
      </div>
    </>
  );
};

export default HamburgerMenu;
