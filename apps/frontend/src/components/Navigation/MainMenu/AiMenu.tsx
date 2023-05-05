import React, { useState, useEffect } from "react";
import "./AiMenu.css";
import imageBanner from '../../../images/0_3.png';
import SVG_FOR_DEBUTANT from '../../../images/SVG_FOR_DEBUTANT.svg';
import SVG_FOR_INTERMEDIAIRE from '../../../images/SVG_FOR_INTERMEDIAIRE.svg';
import SVG_PATH_FOR_EXPERT from '../../../images/SVG_PATH_FOR_EXPERT.svg';
import SVG_PATH_FOR_MAITRE from '../../../images/SVG_PATH_FOR_MAITRE.svg';
import SVG_PATH_FOR_GRAND_MAITRE from '../../../images/SVG_PATH_FOR_GRAND_MAITRE.svg';
import SVG_PATH_FOR_IMPOSSIBLE from '../../../images/SVG_PATH_FOR_IMPOSSIBLE.svg';
import { useNavigate } from "react-router-dom";

interface Props {
  onBackClick: () => void;
}

const AiMenu: React.FC<Props> = ({ onBackClick }) => {
  const [sliderValue, setSliderValue] = useState(1);
  const [elo, setElo] = useState(550);
  const navigate = useNavigate();

  const getLevel = (elo: number) => {
    if (elo < 1000) return "Debutant";
    if (elo < 1600) return "Intermediaire";
    if (elo < 2000) return "Expert";
    if (elo < 2600) return "Maitre";
    if (elo < 3200) return "Grand Maitre";
    return "Impossible";
  };

  const getSvgPath = (elo: number) => {
    if (elo < 1000) {
      return SVG_FOR_DEBUTANT;
    } else if (elo < 1600) {
      return SVG_FOR_INTERMEDIAIRE;
    } else if (elo < 2000) {
      return SVG_PATH_FOR_EXPERT;
    } else if (elo < 2600) {
      return SVG_PATH_FOR_MAITRE;
    } else if (elo < 3200) {
      return SVG_PATH_FOR_GRAND_MAITRE;
    } else {
      return SVG_PATH_FOR_IMPOSSIBLE;
    }
  };

  const startAiGame = () => {
    navigate('/GameAi?eloAi=' + elo);
  };

  const updateSliderColor = () => {
    const percentage = ((sliderValue - 1) / (25 - 1)) * 100;
    const slider = document.querySelector(".slider") as HTMLInputElement;
    if (slider) {
      slider.style.background = `linear-gradient(to right, #007DF0 ${percentage}%, #d3d3d3 ${percentage}%)`;
    }
  };

  //PROBALEMENT UNE BIEN MEILLEURE SOLUTION
  const getElo = (sliderValue: number) => {
    if (sliderValue <= 5) return 400 + (sliderValue - 1) * 100;
    if (sliderValue <= 10) return 1000 + (sliderValue - 6) * 120;
    if (sliderValue <= 14) return 1600 + (sliderValue - 11) * 100;
    if (sliderValue <= 18) return 2000 + (sliderValue - 15) * 175;
    if (sliderValue === 19) return 2700;
    if (sliderValue <= 22) return 2700 + (sliderValue - 19) * 166;
    if (sliderValue === 23) return 3200;
    return 3600;
  }

  useEffect(() => {
    updateSliderColor();
    setElo(getElo(sliderValue));
  }, [sliderValue]);

  return (
    <section className="AiMenu">
      <div>
        <div className="left-container">
          <span onClick={onBackClick}>Retour</span>
          <div className="cta-box">
            <div className="icon"></div>
            <span className="text">VS l’ordinateur</span>
          </div>
          <div className="menu-container">
            <div className="cards">
              <img src={getSvgPath(elo)} alt="SVG as an image" />
            </div>
            <span>{`${getLevel(elo)} (${elo})`}</span>
            <div className="slider-container">
              <input
                type="range"
                min="1"
                max="24"
                value={sliderValue}
                className="slider"
                id="difficulty-slider"
                onChange={(e) => setSliderValue(parseInt(e.target.value))}
              />            <div className="slider-marks">
                <span>500</span>
                <span>1000</span>
                <span>1600</span>
                <span>2000</span>
                <span>2700</span>
                <span>3200</span>
              </div>
            </div>
            <button onClick={startAiGame} className="playbutton">⚔️Jouer</button>
          </div>
        </div>
        <div className="right-container">
          <div>
            <img src={imageBanner} alt="" srcSet="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiMenu;
