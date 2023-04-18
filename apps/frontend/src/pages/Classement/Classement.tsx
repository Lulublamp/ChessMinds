import React, { FC, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './styleClassement.css';
import { UserContext } from '../../components/UserContext';
import imageBanner from '../../images/0_1.png';
import { API_BASE_URL } from '../../config';

type Player = {
  idClassement: number;
  name: string;
  elo: number;
};

const Classement: FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const userContext = useContext(UserContext);
  const [typePartie, setTypePartie] = useState('elo_bullet');
  const [user, setUser] = useState<{ place: number; name: string; elo: number } | null>(null);

  const handleBulletClick = () => {
    setTypePartie('elo_bullet');
  };

  const handleBlitzClick = () => {
    setTypePartie('elo_blitz');
  };

  const handleRapideClick = () => {
    setTypePartie('elo_rapide');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playersResponse = await axios.get(`${API_BASE_URL}/classement/top20?typePartie=${typePartie}`);
        setPlayers(playersResponse.data.map((player: any) => ({
          idClassement: player.idClassement,
          name: player.user_id.pseudo,
          elo: player[typePartie],
        })));
        if (localStorage.getItem("accessToken") && userContext.user) {
          const userResponse = await axios.get(`${API_BASE_URL}/classement/elo`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
          const rank = await axios.get(`${API_BASE_URL}/classement/myrank?typePartie=${typePartie}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
          setUser({
            place: rank.data,
            name: userContext.user?.pseudo,
            elo: typePartie === 'elo_bullet' ? userResponse.data.elo_bullet : typePartie === 'elo_blitz' ? userResponse.data.elo_blitz : userResponse.data.elo_rapide,
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, [typePartie]);

  const CrownIcon = () => (
    <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
      <path d="M13.5 9L16.875 14.85L20.25 11.8125L19.4625 15.75H7.5375L6.75 11.8125L10.125 14.85L13.5 9ZM13.5 4.5L9.5625 11.25L3.375 5.625L5.625 18H21.375L23.625 5.625L17.4375 11.25L13.5 4.5ZM21.375 20.25H5.625V21.375C5.625 22.05 6.075 22.5 6.75 22.5H20.25C20.925 22.5 21.375 22.05 21.375 21.375V20.25Z" fill="#FFF85B" />
    </svg>
  );

  const playerList = players.map((player, index) => (
    <div key={player.idClassement}>
      <span>#{index + 1}</span>
      <span>
        {player.name}
        {index === 0 && <CrownIcon />}
      </span>
      <span>{player.elo}</span>
    </div>
  ));

  return (
    <section className="Classement">
      <div className="leftContainer">
        <h1>Classement</h1>
        <h2>Découvrez le classement des meilleurs joueurs (et le vôtre)</h2>
        <div className="categories">
          <div className={typePartie === 'elo_bullet' ? 'selected' : ''} onClick={handleBulletClick}>
            <svg width="10" height="20" viewBox="0 0 10 20" fill="none">
              <path d="M5.0002 6.25051e-05C5.0002 6.25051e-05 0.000228881 2.49992 0.000228881 8.74998V13.7499C0.000228881 15 0.000229239 15 1.25026 15H8.75012C10.0002 15 10.0002 15 10.0002 13.75V8.74995C10.0002 2.49992 5.0002 6.25051e-05 5.0002 6.25051e-05ZM5.0002 3.12496C5.0002 3.12496 7.50008 4.37502 7.50008 8.74998V11.2499H2.50011V8.74998C2.50011 4.375 5.0002 3.12496 5.0002 3.12496ZM0.526393 16.8749H9.47378C9.76441 16.8749 10.0002 17.1104 10.0002 17.4013V19.4736C10.0002 19.7642 9.76462 20 9.47378 20H0.526414C0.235791 20 0 19.7644 0 19.4736V17.4013C0.000208332 17.1104 0.23579 16.8749 0.526393 16.8749Z" fill="#212121" />
            </svg>
            <span>Bullet</span>
          </div>
          <div className={typePartie === 'elo_blitz' ? 'selected' : ''} onClick={handleBlitzClick}>
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
              <path d="M15.8906 7.5811C15.8075 7.4166 15.6802 7.27826 15.523 7.18143C15.3658 7.08459 15.1847 7.03304 14.9999 7.03248H9.99582V1.04747C10.0066 0.8287 9.94475 0.612489 9.81995 0.43221C9.69514 0.25193 9.51427 0.117604 9.30525 0.0499668C9.10431 -0.015925 8.88759 -0.0166655 8.68621 0.0478516C8.48482 0.112369 8.30912 0.238825 8.18434 0.409067L0.1778 11.3816C0.0774834 11.5261 0.0172472 11.6944 0.00318763 11.8696C-0.010872 12.0448 0.0217441 12.2205 0.0977344 12.3791C0.167713 12.5604 0.289279 12.7174 0.44751 12.8308C0.60574 12.9442 0.79375 13.0091 0.988461 13.0175H5.99255V19.0025C5.9927 19.2128 6.05957 19.4178 6.1836 19.588C6.30762 19.7582 6.48246 19.8849 6.68311 19.9501C6.78366 19.9812 6.88811 19.998 6.99336 20C7.15128 20.0004 7.30705 19.9636 7.44794 19.8925C7.58884 19.8214 7.71086 19.7181 7.80403 19.591L15.8106 8.61851C15.9184 8.46967 15.9829 8.29407 15.9971 8.11103C16.0112 7.92799 15.9744 7.74462 15.8906 7.5811ZM7.99418 15.9302V12.02C7.99418 11.7554 7.88874 11.5017 7.70105 11.3146C7.51336 11.1276 7.2588 11.0225 6.99336 11.0225H2.9901L7.99418 4.11977V8.02998C7.99418 8.29453 8.09962 8.54825 8.28731 8.73532C8.475 8.92239 8.72956 9.02748 8.995 9.02748H12.9983L7.99418 15.9302Z" fill="#212121" />
            </svg>
            <span>Blitz</span>
          </div>
          <div className={typePartie === 'elo_rapide' ? 'selected' : ''} onClick={handleRapideClick}>
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none" >
              <path d="M9.0005 11H11.0005C11.2657 11 11.5201 11.1054 11.7076 11.2929C11.8951 11.4804 12.0005 11.7348 12.0005 12C12.0005 12.2652 11.8951 12.5196 11.7076 12.7071C11.5201 12.8946 11.2657 13 11.0005 13H8.0005C7.86907 13.0004 7.73885 12.9748 7.61735 12.9247C7.49584 12.8746 7.38545 12.8009 7.29251 12.708C7.19957 12.615 7.12593 12.5046 7.07581 12.3831C7.0257 12.2616 7.0001 12.1314 7.0005 12V8C7.0005 7.73478 7.10586 7.48043 7.29339 7.29289C7.48093 7.10535 7.73528 7 8.0005 7C8.26572 7 8.52007 7.10535 8.70761 7.29289C8.89514 7.48043 9.0005 7.73478 9.0005 8V11ZM1.8695 6.861C1.64102 6.75503 1.44289 6.59323 1.2934 6.39053C1.14391 6.18783 1.04786 5.95075 1.01412 5.70115C0.980387 5.45156 1.01004 5.19748 1.10035 4.96237C1.19066 4.72725 1.33872 4.51866 1.53088 4.35583C1.72303 4.19301 1.95309 4.08119 2.19984 4.03068C2.44659 3.98018 2.70209 3.99263 2.94276 4.06687C3.18344 4.14111 3.40154 4.27476 3.57696 4.45549C3.75238 4.63622 3.87947 4.85822 3.9465 5.101C4.30688 4.88907 4.68337 4.70584 5.0725 4.553C4.63516 4.2491 4.3063 3.81348 4.13383 3.30962C3.96136 2.80576 3.9543 2.25999 4.11368 1.75184C4.27306 1.24368 4.59054 0.799703 5.01987 0.484591C5.4492 0.169479 5.96794 -0.000297705 6.5005 3.91882e-07H9.5005C10.0331 -0.000297705 10.5518 0.169479 10.9811 0.484591C11.4105 0.799703 11.7279 1.24368 11.8873 1.75184C12.0467 2.25999 12.0396 2.80576 11.8672 3.30962C11.6947 3.81348 11.3658 4.2491 10.9285 4.553C11.3185 4.707 11.6955 4.89 12.0545 5.101C12.1215 4.85822 12.2486 4.63622 12.424 4.45549C12.5995 4.27476 12.8176 4.14111 13.0582 4.06687C13.2989 3.99263 13.5544 3.98018 13.8012 4.03068C14.0479 4.08119 14.278 4.19301 14.4701 4.35583C14.6623 4.51866 14.8103 4.72725 14.9006 4.96237C14.991 5.19748 15.0206 5.45156 14.9869 5.70115C14.9531 5.95075 14.8571 6.18783 14.7076 6.39053C14.5581 6.59323 14.36 6.75503 14.1315 6.861C15.1094 8.02784 15.734 9.44948 15.932 10.959C16.1301 12.4685 15.8932 14.0031 15.2494 15.3827C14.6056 16.7623 13.5815 17.9295 12.2974 18.7473C11.0132 19.5651 9.52242 19.9995 8 19.9995C6.47758 19.9995 4.98676 19.5651 3.70264 18.7473C2.41851 17.9295 1.3944 16.7623 0.750576 15.3827C0.106751 14.0031 -0.130056 12.4685 0.0679676 10.959C0.265991 9.44948 0.891622 8.02784 1.8695 6.861ZM8.0005 18C9.5918 18 11.1179 17.3678 12.2431 16.2426C13.3684 15.1174 14.0005 13.5913 14.0005 12C14.0005 10.4087 13.3684 8.88257 12.2431 7.75736C11.1179 6.63214 9.5918 6 8.0005 6C6.4092 6 4.88308 6.63214 3.75786 7.75736C2.63264 8.88257 2.0005 10.4087 2.0005 12C2.0005 13.5913 2.63264 15.1174 3.75786 16.2426C4.88308 17.3678 6.4092 18 8.0005 18ZM6.5005 2C6.36789 2 6.24072 2.05268 6.14695 2.14645C6.05318 2.24021 6.0005 2.36739 6.0005 2.5C6.0005 2.63261 6.05318 2.75978 6.14695 2.85355C6.24072 2.94732 6.36789 3 6.5005 3H9.5005C9.63311 3 9.76028 2.94732 9.85405 2.85355C9.94782 2.75978 10.0005 2.63261 10.0005 2.5C10.0005 2.36739 9.94782 2.24021 9.85405 2.14645C9.76028 2.05268 9.63311 2 9.5005 2H6.5005Z" fill="#212121" />
            </svg>
            <span>Rapide</span>
          </div>
        </div>
        <div className="container">
          <header>
            <span>Place</span>
            <span>Pseudo</span>
            <span>Elo</span>
          </header>
          <main>{playerList}</main>
          {user && (
            <>
              <div>
                <span>Votre place dans le classement</span>
              </div>
              <footer>
                <span>#{user.place}</span>
                <span>{user.name}</span>
                <span>{user.elo}</span>
              </footer>
            </>
          )}
        </div>
      </div>
      <div className="right-container">
        <div>
          <img src={imageBanner} alt="chess" />
        </div>
      </div>
    </section>
  );
};

export default Classement;
