import React, { useState } from 'react';

interface Props {
  onPlayClick: () => void;
  goClassementPage: () => void;
}

const HamburgerMenu: React.FC<Props> = ({ onPlayClick, goClassementPage }) => {
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
        <span>Apprendre</span>
        <span onClick={goClassementPage}>Classement</span>
      </div>
    </>
  );
};

export default HamburgerMenu;
