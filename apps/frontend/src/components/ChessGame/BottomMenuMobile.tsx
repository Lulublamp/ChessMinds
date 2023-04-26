import React from 'react';
import './BottomMenuMobile.css';

interface BottomMenuMobileProps {
  onAbandon: () => void;
  onDraw: () => void;
  onPreviousMove: () => void;
  onNextMove: () => void;
}

const BottomMenuMobile: React.FC<BottomMenuMobileProps> = ({ onAbandon, onDraw, onPreviousMove, onNextMove }) => {
  const onChatOpen = () => {
    
  };

  return (
    <div className='MenuChessEventMobile'>
      <div onClick={onAbandon}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 16C4 16 5 15 8 15C11 15 13 17 16 17C19 17 20 16 20 16V4C20 4 19 5 16 5C13 5 11 3 8 3C5 3 4 4 4 4V21" stroke="#E63946" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Abandonner</span>
      </div>
      <div onClick={onDraw}>
        <svg width="21" height="24" viewBox="0 0 21 24" fill="none" >
          <path d="M2.31679 14V5.04L3.29679 6.02H0.356789V4.2H4.58479V14H2.31679Z" fill="#222931" />
          <path d="M12.8331 21V19.53L16.6131 15.96C16.9118 15.6893 17.1311 15.4467 17.2711 15.232C17.4111 15.0173 17.5044 14.8213 17.5511 14.644C17.6071 14.4667 17.6351 14.3033 17.6351 14.154C17.6351 13.762 17.4998 13.4633 17.2291 13.258C16.9678 13.0433 16.5804 12.936 16.0671 12.936C15.6564 12.936 15.2738 13.0153 14.9191 13.174C14.5738 13.3327 14.2798 13.58 14.0371 13.916L12.3851 12.852C12.7584 12.292 13.2811 11.8487 13.9531 11.522C14.6251 11.1953 15.3998 11.032 16.2771 11.032C17.0051 11.032 17.6398 11.1533 18.1811 11.396C18.7318 11.6293 19.1564 11.9607 19.4551 12.39C19.7631 12.8193 19.9171 13.3327 19.9171 13.93C19.9171 14.2473 19.8751 14.5647 19.7911 14.882C19.7164 15.19 19.5578 15.5167 19.3151 15.862C19.0818 16.2073 18.7364 16.5947 18.2791 17.024L15.1431 19.978L14.7091 19.152H20.2391V21H12.8331Z" fill="#222931" />
          <line x1="1.13082" y1="21.1621" x2="17.162" y2="5.13085" stroke="#222931" />
        </svg>
        <span>Nulle</span>
      </div>
      <div onClick={onChatOpen}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15.5 11.5H15.51M11.5 11.5H11.51M7.5 11.5H7.51M15.6953 19.2318L19.1027 20.3676C19.8845 20.6282 20.6282 19.8844 20.3676 19.1027L19.2318 15.6953M15.3 19.1C15.3 19.1 14.0847 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5C20 14 19.1 15.3 19.1 15.3" stroke="#222931" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Tchat</span>
      </div>
      <div>
        <svg onClick={onPreviousMove} width="26" height="26" viewBox="0 0 26 26" fill="none">
          <path d="M6.33333 13H19.6667M6.33333 13L11.6667 7.66667M6.33333 13L11.6667 18.3333M25 13C25 19.6274 19.6274 25 13 25C6.37258 25 1 19.6274 1 13C1 6.37258 6.37258 1 13 1C19.6274 1 25 6.37258 25 13Z" stroke="#222931" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg onClick={onNextMove} width="26" height="26" viewBox="0 0 26 26" fill="none">
          <path d="M19.6667 13H6.33333M19.6667 13L14.3333 18.3333M19.6667 13L14.3333 7.66667M25 13C25 19.6274 19.6274 25 13 25C6.37258 25 1 19.6274 1 13C1 6.37258 6.37258 1 13 1C19.6274 1 25 6.37258 25 13Z" stroke="#222931" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

export default BottomMenuMobile;