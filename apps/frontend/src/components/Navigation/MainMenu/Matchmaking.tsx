import React,{ useState }  from 'react';
import './styleMatchmaking.css';
import EloContainer from '../../Profil/EloContainer';
import RankedSwitch from './RankedSwitch';
import PlayButton from '../../Button/PlayButton';
import imageBanner from '../../../images/0_1.png';
import TimeMode from './TimeMode';
import { MATCHMAKING_MODES_TIMERS, MATCHMAKING_MODE } from '@TRPI/core/core-network';


interface Props {
  onBackClick: () => void;
}

const Matchmaking: React.FC<Props> = ({onBackClick}) => {
  const [selectedTimeMod, setSelectedTimeMod] = useState<MATCHMAKING_MODES_TIMERS>('bullet');
  const [isRanked, setIsRanked] = useState<MATCHMAKING_MODE>('unranked');
  
  const handleTimeModeSelect = (timeMode: MATCHMAKING_MODES_TIMERS) => {
    setSelectedTimeMod(timeMode);
  };

  const handleRankedChange = (checked: MATCHMAKING_MODE) => {
    setIsRanked(checked);
  };

  return (
    <section className="Matchmaking">
      <div>
        <div className="left-container">
          <span onClick={onBackClick}>Retour</span>
          <div className="cta-box">
            <div className="icon"></div>
            <span className="text">Matchmaking</span>
          </div>
          <EloContainer />
          <div className="menu-container">
            <TimeMode onTimeModeSelect={handleTimeModeSelect}/>
            <RankedSwitch onRankedChange={handleRankedChange}/>
            <PlayButton selectedTimeMod={selectedTimeMod} isRanked={isRanked}/>
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

export default Matchmaking;
