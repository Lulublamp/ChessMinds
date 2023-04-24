import React from 'react';
import './ChessGameEndPopup.css';
import ProfileImage from '../Logo_Icon/ProfileImage';

interface Props {
  winner: string;
  playerName1: string;
  playerName2: string;
  gameType: string;
  ranking: number;
  rankingChange: number;
  onNewGame: () => void;
  onReturn: () => void;
}

const GetSvg = (gameType: string) => {
  switch (gameType) {
    case 'bullet':
      return (
        <svg width="15" height="30" viewBox="0 0 15 30" fill="none">
          <path d="M7.5003 9.37576e-05C7.5003 9.37576e-05 0.000343321 3.74989 0.000343321 13.125V20.6249C0.000343321 22.5 0.000343859 22.5 1.8754 22.5H13.1252C15.0003 22.5 15.0003 22.5 15.0003 20.625V13.1249C15.0003 3.74989 7.5003 9.37576e-05 7.5003 9.37576e-05ZM7.5003 4.68744C7.5003 4.68744 11.2501 6.56253 11.2501 13.125V16.8748H3.75017V13.125C3.75017 6.5625 7.5003 4.68744 7.5003 4.68744ZM0.789589 25.3123H14.2107C14.6466 25.3123 15.0003 25.6656 15.0003 26.1019V29.2104C15.0003 29.6463 14.6469 30 14.2107 30H0.789621C0.353686 30 0 29.6467 0 29.2104V26.1019C0.000312498 25.6656 0.353686 25.3123 0.789589 25.3123Z" fill="#212121" />
        </svg>
      );
    case 'blitz':
      return (
        <svg width="30" height="38" viewBox="0 0 30 38" fill="none">
          <path d="M29.7949 14.2146C29.639 13.9061 29.4004 13.6467 29.1056 13.4652C28.8108 13.2836 28.4713 13.1869 28.1248 13.1859H18.7422V1.964C18.7623 1.55381 18.6464 1.14842 18.4124 0.810393C18.1784 0.472369 17.8393 0.220508 17.4473 0.0936877C17.0706 -0.0298594 16.6642 -0.0312478 16.2866 0.0897217C15.909 0.210691 15.5796 0.447797 15.3456 0.767001L0.333374 21.3405C0.145281 21.6114 0.0323386 21.9271 0.00597681 22.2555C-0.0203849 22.5839 0.0407702 22.9135 0.183252 23.2108C0.314462 23.5507 0.542398 23.8451 0.83908 24.0577C1.13576 24.2703 1.48828 24.392 1.85337 24.4078H11.236V35.6297C11.2363 36.0241 11.3617 36.4083 11.5942 36.7274C11.8268 37.0465 12.1546 37.2842 12.5308 37.4065C12.7194 37.4647 12.9152 37.4962 13.1126 37.5C13.4086 37.5008 13.7007 37.4317 13.9649 37.2984C14.2291 37.1651 14.4579 36.9714 14.6325 36.7332L29.6448 16.1597C29.847 15.8806 29.968 15.5514 29.9945 15.2082C30.021 14.865 29.9519 14.5212 29.7949 14.2146ZM14.9891 29.8691V22.5375C14.9891 22.0414 14.7914 21.5657 14.4395 21.215C14.0875 20.8642 13.6102 20.6672 13.1126 20.6672H5.60643L14.9891 7.72457V15.0562C14.9891 15.5522 15.1868 16.028 15.5387 16.3787C15.8906 16.7295 16.3679 16.9265 16.8656 16.9265H24.3717L14.9891 29.8691Z" fill="#212121" />
        </svg>);
    case 'rapid':
      return (
        <svg width="30" height="38" viewBox="0 0 30 38" fill="none">
          <path d="M16.8759 20.625H20.6259C21.1232 20.625 21.6001 20.8225 21.9518 21.1742C22.3034 21.5258 22.5009 22.0027 22.5009 22.5C22.5009 22.9973 22.3034 23.4742 21.9518 23.8258C21.6001 24.1774 21.1232 24.375 20.6259 24.375H15.0009C14.7545 24.3757 14.5104 24.3277 14.2825 24.2338C14.0547 24.1398 13.8477 24.0017 13.6735 23.8275C13.4992 23.6532 13.3611 23.4462 13.2672 23.2184C13.1732 22.9906 13.1252 22.7464 13.1259 22.5V15C13.1259 14.5027 13.3235 14.0258 13.6751 13.6742C14.0267 13.3225 14.5037 13.125 15.0009 13.125C15.4982 13.125 15.9751 13.3225 16.3268 13.6742C16.6784 14.0258 16.8759 14.5027 16.8759 15V20.625ZM3.50532 12.8644C3.0769 12.6657 2.70542 12.3623 2.42512 11.9822C2.14483 11.6022 1.96474 11.1576 1.90148 10.6897C1.83823 10.2217 1.89383 9.74528 2.06316 9.30444C2.23249 8.8636 2.51011 8.47249 2.8704 8.16719C3.23069 7.86189 3.66205 7.65222 4.12471 7.55753C4.58736 7.46284 5.06641 7.48618 5.51768 7.62538C5.96894 7.76459 6.37789 8.01518 6.7068 8.35405C7.03571 8.69292 7.274 9.10916 7.39969 9.56437C8.07539 9.16701 8.78132 8.82345 9.51094 8.53687C8.69093 7.96706 8.07431 7.15027 7.75093 6.20554C7.42755 5.2608 7.41432 4.23748 7.71315 3.28469C8.01198 2.33191 8.60726 1.49944 9.41226 0.908608C10.2173 0.317773 11.1899 -0.000558197 12.1884 7.34778e-07H17.8134C18.812 -0.000558197 19.7846 0.317773 20.5896 0.908608C21.3946 1.49944 21.9899 2.33191 22.2887 3.28469C22.5876 4.23748 22.5743 5.2608 22.2509 6.20554C21.9276 7.15027 21.3109 7.96706 20.4909 8.53687C21.2222 8.82562 21.9291 9.16875 22.6022 9.56437C22.7279 9.10916 22.9662 8.69292 23.2951 8.35405C23.624 8.01518 24.0329 7.76459 24.4842 7.62538C24.9355 7.48618 25.4145 7.46284 25.8772 7.55753C26.3398 7.65222 26.7712 7.86189 27.1315 8.16719C27.4918 8.47249 27.7694 8.8636 27.9387 9.30444C28.108 9.74528 28.1636 10.2217 28.1004 10.6897C28.0371 11.1576 27.857 11.6022 27.5768 11.9822C27.2965 12.3623 26.925 12.6657 26.4966 12.8644C28.3301 15.0522 29.5013 17.7178 29.8726 20.5481C30.2439 23.3784 29.7998 26.2558 28.5927 28.8426C27.3855 31.4293 25.4653 33.6179 23.0576 35.1512C20.6498 36.6846 17.8545 37.4991 15 37.4991C12.1455 37.4991 9.35018 36.6846 6.94245 35.1512C4.53471 33.6179 2.6145 31.4293 1.40733 28.8426C0.200157 26.2558 -0.243855 23.3784 0.127439 20.5481C0.498734 17.7178 1.67179 15.0522 3.50532 12.8644ZM15.0009 33.75C17.9846 33.75 20.8461 32.5647 22.9559 30.4549C25.0657 28.3452 26.2509 25.4837 26.2509 22.5C26.2509 19.5163 25.0657 16.6548 22.9559 14.545C20.8461 12.4353 17.9846 11.25 15.0009 11.25C12.0173 11.25 9.15577 12.4353 7.04599 14.545C4.93621 16.6548 3.75094 19.5163 3.75094 22.5C3.75094 25.4837 4.93621 28.3452 7.04599 30.4549C9.15577 32.5647 12.0173 33.75 15.0009 33.75ZM12.1884 3.75C11.9398 3.75 11.7013 3.84877 11.5255 4.02459C11.3497 4.2004 11.2509 4.43886 11.2509 4.6875C11.2509 4.93614 11.3497 5.1746 11.5255 5.35041C11.7013 5.52623 11.9398 5.625 12.1884 5.625H17.8134C18.0621 5.625 18.3005 5.52623 18.4763 5.35041C18.6522 5.1746 18.7509 4.93614 18.7509 4.6875C18.7509 4.43886 18.6522 4.2004 18.4763 4.02459C18.3005 3.84877 18.0621 3.75 17.8134 3.75H12.1884Z" fill="#212121" />
        </svg>);
  }
}




const ChessGameEndPopup: React.FC<Props> = ({
  winner,
  playerName1,
  playerName2,
  gameType,
  ranking,
  rankingChange,
  onNewGame,
  onReturn,
}) => {
  return (
    <div className="PopUpFinDePartie">
      <div></div>
      <div>
        <div>
          <h2>{winner} ont gagné</h2>
          <div>
            <div>
              <ProfileImage id={0} alt="Icon Player 1" />
              <span>{playerName1}</span>
            </div>
            <div>
              {GetSvg(gameType)}
              <span>{gameType}</span>
            </div>
            <div>
              <ProfileImage id={0} alt="Icon Player 2" />
              <span>{playerName2}</span>
            </div>
          </div>
          <span>Classement</span>
          <span>
            {ranking} <span>{rankingChange > 0 ? '+' : ''}{rankingChange}</span>
          </span>
          <button onClick={onNewGame}>🕹️ Nouvelle partie</button>
          <button onClick={onReturn}>Retour</button>
          <div className="partage">
            <span>Partager</span>
            <div>
              <input type="text" readOnly value="https://ChessMind?id=116544132456" />
              <button>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8.68439 10.6578L15.3125 7.34375M15.3156 16.6578L8.6938 13.3469M21 6C21 7.65685 19.6569 9 18 9C16.3431 9 15 7.65685 15 6C15 4.34315 16.3431 3 18 3C19.6569 3 21 4.34315 21 6ZM9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12ZM21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15C19.6569 15 21 16.3431 21 18Z"
                    stroke="white" stroke-width="1.5" />
                </svg>
              </button>
              <span>Click to copy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessGameEndPopup;
