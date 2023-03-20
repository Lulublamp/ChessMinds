import React from 'react';
import "./NavBarStyle.css";
import Logo from '../Logo_Icon/Logo';
import Connexion from '../../components/Navigation/Connexion';


function Navbar() {
  const [showConnexion, setShowConnexion] = React.useState(false);

  const OpenPopupConnexion = () => {
    setShowConnexion(true);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__left">
          <a href="#" className="navbar__logo"><Logo></Logo></a>
          <ul className="navbar__list">
            <li className="navbar__item"><a href="#">Jouer</a></li>
            <li className="navbar__item"><a href="#">Apprendre</a></li>
            <li className="navbar__item"><a href="#">Classement</a></li>
          </ul>
          <div className="hamburgerMenu">
            <svg width="28" height="19" viewBox="0 0 28 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M26.0522 7.63989H1.45159C0.649898 7.63989 0 8.28979 0 9.09148V9.24428C0 10.046 0.649898 10.6959 1.45159 10.6959H26.0522C26.8539 10.6959 27.5038 10.046 27.5038 9.24428V9.09148C27.5038 8.28979 26.8539 7.63989 26.0522 7.63989Z" fill="#F5F5F5"/>
              <path d="M26.0522 15.2798H1.45159C0.649898 15.2798 0 15.9297 0 16.7314V16.8842C0 17.6859 0.649898 18.3358 1.45159 18.3358H26.0522C26.8539 18.3358 27.5038 17.6859 27.5038 16.8842V16.7314C27.5038 15.9297 26.8539 15.2798 26.0522 15.2798Z" fill="#F5F5F5"/>
              <path d="M26.0522 0H1.45159C0.649898 0 0 0.649898 0 1.45159V1.60439C0 2.40608 0.649898 3.05597 1.45159 3.05597H26.0522C26.8539 3.05597 27.5038 2.40608 27.5038 1.60439V1.45159C27.5038 0.649898 26.8539 0 26.0522 0Z" fill="#F5F5F5"/>
            </svg>                        
          </div>
        </div>
        <div className="navbar__right">
          <button className="navbar__button" onClick={OpenPopupConnexion}>Connexion</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
