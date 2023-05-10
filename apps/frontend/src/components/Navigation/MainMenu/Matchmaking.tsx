import React,{ useState , useEffect }  from 'react';
import './styleMatchmaking.css';
import EloContainer from '../../Profil/EloContainer';
import RankedSwitch from './RankedSwitch';
import PlayButton from '../../Button/PlayButton';
import imageBanner from '../../../images/0_1.png';
import TimeMode from './TimeMode';
import { MATCHMAKING_MODES_TIMERS, MATCHMAKING_MODE } from '@TRPI/core/core-network';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import { useSearchParams } from 'react-router-dom';


interface Props {
  onBackClick: () => void;
}

const Matchmaking: React.FC<Props> = ({onBackClick}) => {
  const [selectedTimeMod, setSelectedTimeMod] = useState<MATCHMAKING_MODES_TIMERS>('bullet');
  const [isRanked, setIsRanked] = useState<MATCHMAKING_MODE>('unranked');
  const [searchParams] = useSearchParams();

  const reGame = searchParams.get('newGame');

  
  const handleTimeModeSelect = (timeMode: MATCHMAKING_MODES_TIMERS) => {
    setSelectedTimeMod(timeMode);
  };

  const handleRankedChange = (checked: MATCHMAKING_MODE) => {
    setIsRanked(checked);
  };

  async function getMatchMaking() {
    const response = await axios.get(`${API_BASE_URL}/match-making`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response;
  }
  



  useEffect(() => {
    async function fetchData() {
      console.log('mounted');
      try {
        const response = await getMatchMaking();
        console.log(response.data.result);
        if (response.data.result == true) {
          console.log('tu peu jouer');
        }else {
          console.log('tu peu pas jouer');
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();

    return () => {
      console.log('unmounting...');
    };
  }, []);

  return (
    <section className="Matchmaking">
      <div>
        <div className="left-container">
          <span onClick={onBackClick}>Retour</span>
          <div className="cta-box">
            <div className="icon"></div>
            <span className="text">Matchmaking</span>
          </div>
          {/* <EloContainer /> */}
          <div className="menu-container">
            <TimeMode onTimeModeSelect={handleTimeModeSelect}/>
            <RankedSwitch onRankedChange={handleRankedChange}/>
            <PlayButton selectedTimeMod={selectedTimeMod} isRanked={isRanked} reGame={reGame ? true : false}/>
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