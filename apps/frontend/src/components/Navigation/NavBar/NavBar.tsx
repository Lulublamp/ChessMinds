import React, { useContext, useEffect } from 'react';
import HamburgerMenu from './HamburgerMenu';
import Logo from '../../Logo/Logo';
import './navStyle.css';
import { UserContext } from '../../UserContext';
import { useNavigate } from 'react-router-dom';

interface Props {
  onPlayClick: () => void;
  onLogoutClick: () => void;
}

const Navbar: React.FC<Props> = ({ onPlayClick, onLogoutClick }) => {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const goHomePage = () => {
    navigate('/');
  };

  const goClassementPage = () => {
    navigate('/Classement');
  };

  const goToProfilePage = () => {
    navigate('/Profil');
  };

  const logout = () => {
    navigate('/');
    onLogoutClick();
  };

  return (
    <nav>
      <HamburgerMenu onPlayClick={onPlayClick} goClassementPage={goClassementPage} />
      <div className="nav-container">
        <div onClick={goHomePage} className="logo-container">
          <Logo width={65} height={65} />
          <h2>
            <span>Chess</span>
            <span>MINDS</span>
          </h2>
        </div>
        <div className="nav-links-container">
          <span className="play-btn" onClick={onPlayClick}>
            Jouer
          </span>
          <span>Apprendre</span>
          <span onClick={goClassementPage}>Classement</span>
        </div>
      </div>
      <div className="button-container">
        {user.user && (
          <svg onClick={goToProfilePage} width="39" height="43" viewBox="0 0 39 43" fill="none">
            <path d="M31.5312 41.3753H7.46875C4.44844 41.3753 2 38.9268 2 35.9065C2 26.9798 15.125 27.1565 19.5 27.1565C23.875 27.1565 37 26.9798 37 35.9065C37 38.9268 34.5516 41.3753 31.5312 41.3753Z" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19.5 19.5C24.3325 19.5 28.25 15.5825 28.25 10.75C28.25 5.91751 24.3325 2 19.5 2C14.6675 2 10.75 5.91751 10.75 10.75C10.75 15.5825 14.6675 19.5 19.5 19.5Z" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        <button className="nav-button play play-btn" onClick={onPlayClick}>
          Jouer
        </button>
        <button className="nav-button download">Télécharger
          <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
            <path d="M1 1L6 6L11 1" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {user.user && (
          <svg width="35" height="36" viewBox="0 0 35 36" fill="none" onClick={logout}>
            <path d="M24.5448 26.4367C24.1797 26.0052 23.9971 25.516 23.9971 24.969C23.9971 24.422 24.1797 23.9653 24.5448 23.5988L28.229 19.9146H13.9402C13.376 19.9146 12.9027 19.7235 12.5203 19.3411C12.138 18.9587 11.9475 18.4861 11.9488 17.9232C11.9488 17.3589 12.14 16.8856 12.5223 16.5033C12.9047 16.1209 13.3773 15.9304 13.9402 15.9317H28.229L24.5448 12.2475C24.1465 11.8492 23.9473 11.3759 23.9473 10.8276C23.9473 10.2793 24.1465 9.80663 24.5448 9.40967C24.9099 9.01137 25.3666 8.81223 25.9149 8.81223C26.4632 8.81223 26.9193 8.99478 27.283 9.35988L34.4523 16.5291C34.6515 16.7283 34.7929 16.944 34.8765 17.1764C34.9601 17.4087 35.0013 17.6576 35 17.9232C35 18.1887 34.9588 18.4376 34.8765 18.67C34.7942 18.9023 34.6528 19.118 34.4523 19.3172L27.283 26.4865C26.8516 26.9179 26.3783 27.1091 25.8631 27.06C25.348 27.0109 24.9086 26.8031 24.5448 26.4367ZM3.98293 35.8463C2.88762 35.8463 1.94965 35.456 1.16899 34.6754C0.388338 33.8947 -0.00132426 32.9574 3.38109e-06 31.8634V3.98293C3.38109e-06 2.88762 0.39033 1.94965 1.17098 1.16899C1.95164 0.388338 2.88895 -0.00132426 3.98293 3.38109e-06H15.9317C16.496 3.38109e-06 16.9693 0.191184 17.3516 0.573545C17.734 0.955906 17.9245 1.42855 17.9232 1.99147C17.9232 2.55571 17.732 3.02902 17.3496 3.41138C16.9673 3.79374 16.4946 3.98426 15.9317 3.98293H3.98293V31.8634H15.9317C16.496 31.8634 16.9693 32.0546 17.3516 32.437C17.734 32.8193 17.9245 33.292 17.9232 33.8549C17.9232 34.4191 17.732 34.8924 17.3496 35.2748C16.9673 35.6572 16.4946 35.8477 15.9317 35.8463H3.98293Z" fill="#D73324" />
          </svg>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
