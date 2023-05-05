import React, { useContext, useEffect } from 'react';
import EloContainer from '../../Profil/EloContainer';
import MenuContainer from './MenuContainer';
import imageBanner from '../../../images/0_2.png';
import imageBannerDark from '../../../images/0_2_dark.png';
import { UserContext, User } from '../../UserContext';
import { useNavigate } from 'react-router-dom';
import './styleMenu.css';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';

interface Props {
  onLogoutClick: () => void;
  onNewGameClick: () => void;
  onPrivateGameClick: () => void;
  onAiGameClick: () => void;
  isDarkMode: boolean;
}

const MainMenu: React.FC<Props> = ({ onLogoutClick, onNewGameClick, onPrivateGameClick, isDarkMode,onAiGameClick }) => {
  const user = useContext(UserContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token === null) {
      navigate('/');
    } else if (user.user === null || user.user === undefined) {
      axios
        .get(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser({
            email: response.data.adresseMail,
            pseudo: response.data.pseudo,
            id: response.data.idJoueur,
          });
        })
        .catch((error) => {
          console.log(error);
          localStorage.removeItem('accessToken');
          navigate('/');
        });
    }
  }, [user, navigate, setUser]);


  return (
    <section className="MainMenu">
      <div>
        <div className="left-container">
          <EloContainer />
          <div className="cta-box">
            <div className="icon"></div>
            <span className="text">Let’s play</span>
          </div>
          <MenuContainer
            onLogoutClick={onLogoutClick}
            onNewGameClick={onNewGameClick}
            onPrivateGameClick={onPrivateGameClick}
            onAiGameClick={onAiGameClick}
          />
        </div>
        <div className="right-container">
          <div>
            <img src={isDarkMode ? imageBannerDark : imageBanner} alt="" srcSet="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainMenu;
