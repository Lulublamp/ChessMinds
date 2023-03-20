import React from 'react';
import './MatchMaking.css';

interface MatchMakingProps {
  onCancel: () => void;
  onPlay: (RankedMode: string, TimerMode: string, Pseudo : string, Elo : number) => void;
}

const MatchMaking: React.FC<MatchMakingProps> = ({ onCancel, onPlay }) => {

  const [RankedMode, setRankedMode] = React.useState('Ranked');
  const [TimerMode, setTimerMode] = React.useState('bullet');
  const [Elo, setElo] = React.useState(100);
  const [Pseudo, setPseudo] = React.useState('pseudo');

  const timeModeBulletRef = React.useRef<HTMLDivElement>(null);
  const timeModeBlitzRef = React.useRef<HTMLDivElement>(null);
  const timeModeRapideRef = React.useRef<HTMLDivElement>(null);

  const handleRankedModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRankedMode(event.target.value);
  };
  
  const handleTimerModeChange = (value:string, event: React.MouseEvent<HTMLDivElement>) => {
    setTimerMode(value);
    //reset all timeModeHover
    if (timeModeBulletRef.current) timeModeBulletRef.current.classList.remove('timeModeHover');
    if (timeModeBlitzRef.current) timeModeBlitzRef.current.classList.remove('timeModeHover');
    if (timeModeRapideRef.current) timeModeRapideRef.current.classList.remove('timeModeHover');
    event.currentTarget.classList.add('timeModeHover');
  };
  
  const handleEloChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setElo(parseInt(event.target.value));
  };

  const handlePseudoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPseudo(event.target.value);
  };

  return (
    <div className="Matchmaking">
      <div className="Matchmaking-container">
        <h2>Matchmaking</h2>
        <input type="text" onChange={handlePseudoChange}/>
        <input type="number" name="elo" onChange={handleEloChange} />
        <div className="Mode-container">
          <div>
            <input type="radio" name="Mode" id="Ranked" value="Ranked"
              checked={RankedMode === 'Ranked'}
              onChange={handleRankedModeChange}
            />
            <label htmlFor="Ranked">Ranked</label>
          </div>
          <div>
            <input type="radio" name="Mode" id="Unranked" value="Unranked"
              checked={RankedMode === 'Unranked'}
              onChange={handleRankedModeChange}
            />
            <label htmlFor="Unranked">Unranked</label>
          </div>
        </div>
        <h3>Type de partie</h3>
        <div className="Mode-container">
          <div ref={timeModeBulletRef} className="timeMode timeModeHover" onClick={(event) => handleTimerModeChange("bullet", event)}>
            <div>
              <svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.13497 0.621156C5.13497 0.621156 0.134995 3.12102 0.134995 9.37107V14.371C0.134995 15.6211 0.134995 15.6211 1.38503 15.6211H8.88489C10.135 15.6211 10.135 15.6211 10.135 14.3711V9.37105C10.135 3.12102 5.13497 0.621156 5.13497 0.621156ZM5.13497 3.74606C5.13497 3.74606 7.63485 4.99611 7.63485 9.37107V11.871H2.63488V9.37107C2.63488 4.99609 5.13497 3.74606 5.13497 3.74606ZM0.661159 17.496H9.60855C9.89917 17.496 10.1349 17.7315 10.1349 18.0224V20.0947C10.1349 20.3853 9.89938 20.6211 9.60855 20.6211H0.66118C0.370556 20.6211 0.134766 20.3855 0.134766 20.0947V18.0224C0.134974 17.7315 0.370556 17.496 0.661159 17.496Z" fill="#F5F5F5" />
              </svg>
              <span>Bullet</span>
            </div>
            <span>1 min</span>
          </div>
          <div ref={timeModeBlitzRef} className="timeMode" onClick={(event) => handleTimerModeChange("blitz", event)}>
            <div>
              <svg width="17" height="21" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.0254 8.2022C15.9422 8.03769 15.815 7.89936 15.6578 7.80252C15.5005 7.70568 15.3195 7.65413 15.1347 7.65357H10.1306V1.66856C10.1413 1.44979 10.0795 1.23358 9.95471 1.0533C9.82991 0.873024 9.64904 0.738698 9.44002 0.671061C9.23908 0.605169 9.02236 0.604428 8.82097 0.668945C8.61959 0.733462 8.44389 0.859919 8.3191 1.03016L0.312565 12.0027C0.212249 12.1472 0.152013 12.3155 0.137953 12.4907C0.123894 12.6659 0.15651 12.8416 0.2325 13.0002C0.302479 13.1815 0.424045 13.3385 0.582275 13.4519C0.740506 13.5653 0.928516 13.6302 1.12323 13.6386H6.12731V19.6236C6.12747 19.8339 6.19434 20.0389 6.31836 20.2091C6.44239 20.3792 6.61722 20.506 6.81788 20.5712C6.91843 20.6023 7.02287 20.6191 7.12813 20.6211C7.28604 20.6215 7.44181 20.5847 7.58271 20.5136C7.7236 20.4425 7.84562 20.3392 7.93879 20.2121L15.9453 9.2396C16.0532 9.09077 16.1177 8.91516 16.1318 8.73213C16.1459 8.54909 16.1091 8.36571 16.0254 8.2022ZM8.12895 16.5513V12.6411C8.12895 12.3765 8.0235 12.1228 7.83581 11.9357C7.64812 11.7487 7.39356 11.6436 7.12813 11.6436H3.12486L8.12895 4.74087V8.65107C8.12895 8.91563 8.23439 9.16934 8.42208 9.35641C8.60977 9.54348 8.86433 9.64857 9.12976 9.64857H13.133L8.12895 16.5513Z" fill="#F5F5F5" />
              </svg>
              <span>Blitz</span>
            </div>
            <span>1 min</span>
          </div>
          <div ref={timeModeRapideRef} className="timeMode" onClick={(event) => handleTimerModeChange("rapid", event)}>
            <div>
              <svg width="17" height="21" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.13526 11.6211H11.1353C11.4005 11.6211 11.6548 11.7264 11.8424 11.914C12.0299 12.1015 12.1353 12.3559 12.1353 12.6211C12.1353 12.8863 12.0299 13.1407 11.8424 13.3282C11.6548 13.5157 11.4005 13.6211 11.1353 13.6211H8.13527C8.00383 13.6215 7.87362 13.5959 7.75211 13.5458C7.63061 13.4957 7.52021 13.422 7.42728 13.3291C7.33434 13.2361 7.26069 13.1257 7.21058 13.0042C7.16047 12.8827 7.13487 12.7525 7.13527 12.6211V8.62109C7.13527 8.35587 7.24062 8.10152 7.42816 7.91398C7.6157 7.72645 7.87005 7.62109 8.13527 7.62109C8.40048 7.62109 8.65484 7.72645 8.84237 7.91398C9.02991 8.10152 9.13526 8.35587 9.13526 8.62109V11.6211ZM2.00427 7.48209C1.77578 7.37612 1.57766 7.21433 1.42816 7.01162C1.27867 6.80892 1.18263 6.57184 1.14889 6.32224C1.11515 6.07265 1.14481 5.81858 1.23512 5.58346C1.32543 5.34834 1.47349 5.13975 1.66564 4.97693C1.8578 4.8141 2.08786 4.70228 2.33461 4.65178C2.58136 4.60128 2.83685 4.61372 3.07753 4.68796C3.3182 4.76221 3.53631 4.89586 3.71173 5.07659C3.88715 5.25732 4.01423 5.47931 4.08127 5.72209C4.44164 5.51016 4.81814 5.32693 5.20727 5.17409C4.76993 4.87019 4.44106 4.43457 4.2686 3.93071C4.09613 3.42685 4.08907 2.88108 4.24844 2.37293C4.40782 1.86478 4.72531 1.4208 5.15464 1.10568C5.58397 0.790573 6.10271 0.620796 6.63527 0.621094H9.63526C10.1678 0.620796 10.6866 0.790573 11.1159 1.10568C11.5452 1.4208 11.8627 1.86478 12.0221 2.37293C12.1815 2.88108 12.1744 3.42685 12.0019 3.93071C11.8295 4.43457 11.5006 4.87019 11.0633 5.17409C11.4533 5.32809 11.8303 5.51109 12.1893 5.72209C12.2563 5.47931 12.3834 5.25732 12.5588 5.07659C12.7342 4.89586 12.9523 4.76221 13.193 4.68796C13.4337 4.61372 13.6892 4.60128 13.9359 4.65178C14.1827 4.70228 14.4127 4.8141 14.6049 4.97693C14.797 5.13975 14.9451 5.34834 15.0354 5.58346C15.1257 5.81858 15.1554 6.07265 15.1216 6.32224C15.0879 6.57184 14.9919 6.80892 14.8424 7.01162C14.6929 7.21433 14.4947 7.37612 14.2663 7.48209C15.2441 8.64893 15.8688 10.0706 16.0668 11.5801C16.2648 13.0896 16.028 14.6242 15.3842 16.0038C14.7404 17.3834 13.7163 18.5506 12.4321 19.3684C11.148 20.1862 9.65719 20.6206 8.13477 20.6206C6.61234 20.6206 5.12153 20.1862 3.8374 19.3684C2.55328 18.5506 1.52917 17.3834 0.885342 16.0038C0.241516 14.6242 0.00470962 13.0896 0.202733 11.5801C0.400757 10.0706 1.02639 8.64893 2.00427 7.48209ZM8.13527 18.6211C9.72656 18.6211 11.2527 17.9889 12.3779 16.8637C13.5031 15.7385 14.1353 14.2124 14.1353 12.6211C14.1353 11.0298 13.5031 9.50367 12.3779 8.37845C11.2527 7.25323 9.72656 6.62109 8.13527 6.62109C6.54397 6.62109 5.01785 7.25323 3.89263 8.37845C2.76741 9.50367 2.13527 11.0298 2.13527 12.6211C2.13527 14.2124 2.76741 15.7385 3.89263 16.8637C5.01785 17.9889 6.54397 18.6211 8.13527 18.6211ZM6.63527 2.62109C6.50266 2.62109 6.37548 2.67377 6.28171 2.76754C6.18795 2.86131 6.13527 2.98848 6.13527 3.12109C6.13527 3.2537 6.18795 3.38088 6.28171 3.47465C6.37548 3.56841 6.50266 3.62109 6.63527 3.62109H9.63526C9.76787 3.62109 9.89505 3.56841 9.98882 3.47465C10.0826 3.38088 10.1353 3.2537 10.1353 3.12109C10.1353 2.98848 10.0826 2.86131 9.98882 2.76754C9.89505 2.67377 9.76787 2.62109 9.63526 2.62109H6.63527Z" fill="#F5F5F5" />
              </svg>
              <span>Rapide</span>
            </div>
            <span>1 min</span>
          </div>
        </div>
        <button className="PlayButton" onClick={() => onPlay(RankedMode, TimerMode, Pseudo, Elo)}>Jouer</button>
        <button className="cancel-btn" onClick={onCancel}>
          <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule='evenodd' clipRule={"evenodd"}
              d="M15.8441 6.32799C15.9154 6.25494 15.9719 6.1682 16.0105 6.07272C16.0491 5.97724 16.069 5.8749 16.0691 5.77152C16.0692 5.66815 16.0494 5.56578 16.0109 5.47026C15.9724 5.37473 15.916 5.28792 15.8448 5.21478C15.7736 5.14164 15.6891 5.0836 15.5961 5.04399C15.503 5.00437 15.4033 4.98395 15.3026 4.98388C15.2019 4.98382 15.1021 5.00412 15.0091 5.04362C14.916 5.08312 14.8314 5.14104 14.7601 5.21409L10.1348 9.96115L5.5108 5.21409C5.36687 5.06638 5.17167 4.9834 4.96813 4.9834C4.76459 4.9834 4.56939 5.06638 4.42546 5.21409C4.28154 5.36181 4.20068 5.56215 4.20068 5.77104C4.20068 5.97994 4.28154 6.18028 4.42546 6.32799L9.0508 11.0737L4.42546 15.8194C4.3542 15.8925 4.29767 15.9793 4.2591 16.0749C4.22053 16.1704 4.20068 16.2729 4.20068 16.3763C4.20068 16.4797 4.22053 16.5822 4.2591 16.6777C4.29767 16.7733 4.3542 16.8601 4.42546 16.9333C4.56939 17.081 4.76459 17.1639 4.96813 17.1639C5.06891 17.1639 5.16871 17.1436 5.26182 17.104C5.35493 17.0644 5.43953 17.0064 5.5108 16.9333L10.1348 12.1862L14.7601 16.9333C14.9041 17.0808 15.0992 17.1636 15.3026 17.1635C15.506 17.1633 15.701 17.0803 15.8448 16.9326C15.9885 16.7849 16.0692 16.5846 16.0691 16.3758C16.069 16.1671 15.9881 15.9669 15.8441 15.8194L11.2188 11.0737L15.8441 6.32799Z"
              fill="#000" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MatchMaking;