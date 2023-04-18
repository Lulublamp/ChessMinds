import React from 'react';
import Card from './Card';
import './HomePageStyle.css';
import imageBanner from '../../images/0_2.png';

interface Props {
  onPlayClick: () => void;
  onDownloadClick: () => void;
}

const HomePage: React.FC<Props> = ({ onPlayClick, onDownloadClick }) => {
  return (
    <section className="HomePage">
      <div>
        <div className="left-container">
          <svg width="83" height="83" viewBox="0 0 83 83" fill="none" className="pyram">
            <path d="M31.7511 18.5413L50.6401 63.8499L16.7351 59.4725L31.7511 18.5413Z" fill="#75B8F7" stroke="#111111"
              strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M71.3952 36.6849L50.6401 63.8499L31.7511 18.5413L71.3952 36.6849Z" stroke="#111111" strokeWidth="4"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="cta-box">
            <div className="icon"></div>
            <span className="text">Let’s play</span>
          </div>
          <h1>
            <span>Relevez le défi de</span>
            <span>
              jouer aux <span>Échecs</span>
            </span>
            <span>en ligne</span>
          </h1>
          <p>
            <span>
              Des parties d'échecs en temps réel avec des joueurs du monde
              entier !
            </span>
            <br />
            <span>
              Inscrivez-vous gratuitement et démarrez votre aventure
              échiquéenne dès aujourd'hui
            </span>
          </p>
          <div className="responsiveCards">
            <Card title="🤖 Entraînez-vous contre l'IA">
              Jouez contre notre intelligence artificielle pour vous préparer
              à affronter de vrais adversaires.
            </Card>
            <Card title="🤝 Défiez vos amis">
              Invitez vos amis à des parties amicales et découvrez qui est le
              véritable maître des échecs parmi vous.
            </Card>
          </div>
          <div className="button-container">
            <svg width="133" height="94" viewBox="0 0 133 94" fill="none" className="arrow">
              <path className="arrow-path"
                d="M81.7223 13.211C79.0433 11.6722 73.3632 10.1162 68.2141 9.50936C53.7069 7.80085 40.7959 11.9605 35.564 20.0285L33.6915 22.9167L29.2604 20.6434C20.1553 15.9718 11.8075 10.1435 5.94693 4.365C1.82047 0.296692 0.666638 -0.174692 0.482904 2.13528C0.0506908 7.56942 13.5272 19.4624 28.0462 26.4593L32.1517 28.4376L32.2404 32.199C32.3488 36.7876 34.5224 44.0713 37.3913 49.4599C40.351 55.0174 52.1654 67.7616 57.8418 71.5182C65.5212 76.6014 72.2243 79.7238 80.8989 82.2592C91.9555 85.4911 108.244 87.467 115.587 86.4668C117.641 86.187 119.431 86.0557 119.563 86.1751C119.696 86.295 119.039 87.5628 118.103 88.9926C114.976 93.7714 116.466 94.7684 122.796 92.1304C126.766 90.4765 130.104 86.971 131.283 83.2206C131.728 81.8066 132.366 80.4022 132.702 80.0996C133.546 79.3382 130.114 75.4626 126.898 73.545C124.14 71.9011 108.228 66.8703 105.934 66.917C104.755 66.9407 104.289 67.2418 103.714 68.3488C102.522 70.6457 104.257 72.2388 109.824 73.9594C117.68 76.3865 121.771 78.0012 121.268 78.4752C119.515 80.1274 108.776 80.2333 98.2546 78.703C82.4304 76.4004 70.0977 71.9371 59.726 64.7584C54.0823 60.8519 45.4279 51.4504 42.5854 46.1378C39.2932 39.9854 36.9038 31.6435 38.2713 31.079C38.5083 30.9814 41.7852 31.6124 45.5533 32.4808C64.4822 36.845 83.0794 34.0241 87.3462 26.142C87.8887 25.1402 88.292 23.1814 88.2423 21.7889C88.1608 19.4812 87.9258 19.0225 85.594 16.6111C84.1869 15.156 82.4444 13.6263 81.7223 13.211ZM85.1989 21.7083C85.2334 22.2595 84.8322 23.5046 84.3069 24.475C80.898 30.7727 62.2 31.8607 44.7183 26.7778C40.7185 25.6148 39.3915 25.0061 39.4111 24.3421C39.4255 23.8548 40.6709 22.1702 42.1786 20.5976C46.9965 15.574 53.6142 13.4361 64.3753 13.4278C71.4473 13.4218 75.1876 14.0587 79.6324 16.0253C82.771 17.4141 85.0759 19.7673 85.1989 21.7083Z" />
              <path className="arrow-fill" mask="url(#maskArrow)"
                d="M81.7223 13.211C79.0433 11.6722 73.3632 10.1162 68.2141 9.50936C53.7069 7.80085 40.7959 11.9605 35.564 20.0285L33.6915 22.9167L29.2604 20.6434C20.1553 15.9718 11.8075 10.1435 5.94693 4.365C1.82047 0.296692 0.666638 -0.174692 0.482904 2.13528C0.0506908 7.56942 13.5272 19.4624 28.0462 26.4593L32.1517 28.4376L32.2404 32.199C32.3488 36.7876 34.5224 44.0713 37.3913 49.4599C40.351 55.0174 52.1654 67.7616 57.8418 71.5182C65.5212 76.6014 72.2243 79.7238 80.8989 82.2592C91.9555 85.4911 108.244 87.467 115.587 86.4668C117.641 86.187 119.431 86.0557 119.563 86.1751C119.696 86.295 119.039 87.5628 118.103 88.9926C114.976 93.7714 116.466 94.7684 122.796 92.1304C126.766 90.4765 130.104 86.971 131.283 83.2206C131.728 81.8066 132.366 80.4022 132.702 80.0996C133.546 79.3382 130.114 75.4626 126.898 73.545C124.14 71.9011 108.228 66.8703 105.934 66.917C104.755 66.9407 104.289 67.2418 103.714 68.3488C102.522 70.6457 104.257 72.2388 109.824 73.9594C117.68 76.3865 121.771 78.0012 121.268 78.4752C119.515 80.1274 108.776 80.2333 98.2546 78.703C82.4304 76.4004 70.0977 71.9371 59.726 64.7584C54.0823 60.8519 45.4279 51.4504 42.5854 46.1378C39.2932 39.9854 36.9038 31.6435 38.2713 31.079C38.5083 30.9814 41.7852 31.6124 45.5533 32.4808C64.4822 36.845 83.0794 34.0241 87.3462 26.142C87.8887 25.1402 88.292 23.1814 88.2423 21.7889C88.1608 19.4812 87.9258 19.0225 85.594 16.6111C84.1869 15.156 82.4444 13.6263 81.7223 13.211ZM85.1989 21.7083C85.2334 22.2595 84.8322 23.5046 84.3069 24.475C80.898 30.7727 62.2 31.8607 44.7183 26.7778C40.7185 25.6148 39.3915 25.0061 39.4111 24.3421C39.4255 23.8548 40.6709 22.1702 42.1786 20.5976C46.9965 15.574 53.6142 13.4361 64.3753 13.4278C71.4473 13.4218 75.1876 14.0587 79.6324 16.0253C82.771 17.4141 85.0759 19.7673 85.1989 21.7083Z" />
            </svg>
            <button className="button-play play-btn" onClick={onPlayClick}>
              Jouer
              <svg width="31" height="25" viewBox="0 0 31 25" fill="none">
                <path d="M29 12.8L2 12.8M29 12.8L18.2 23.6M29 12.8L18.2 2" stroke="white" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="button-download" onClick={onDownloadClick}>
              Télécharger
              <svg width="17" height="10" viewBox="0 0 17 10" fill="none">
                <path d="M1 1L8.5 8.5L16 1" stroke="#212121" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="right-container">
          <div>
            <img src={imageBanner} alt="Image Banniere" srcSet="" />
          </div>
          <Card title="🤖 Entraînez-vous contre l'IA">
            Jouez contre notre intelligence artificielle pour vous préparer à
            affronter de vrais adversaires.
          </Card>
          <Card title="🤝 Défiez vos amis">
            Invitez vos amis à des parties amicales et découvrez qui est le
            véritable maître des échecs parmi vous.
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
