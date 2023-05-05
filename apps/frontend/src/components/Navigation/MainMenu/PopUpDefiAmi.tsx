import React, { FC } from 'react';
import './PopUpDefiAmi.css';

interface PopUpDefiAmiProps {
  onJoinLobby: (lobbyCode: string) => void;
  onCreateLobby: () => void;
  onClose: () => void;
}

const PopUpDefiAmi: FC<PopUpDefiAmiProps> = ({ onJoinLobby, onCreateLobby, onClose }) => {
  const [lobbyCode, setLobbyCode] = React.useState('');

  const handleJoinLobby = () => {
    onJoinLobby(lobbyCode);
  };

  const handleLobbyCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLobbyCode(event.target.value);
  };

  return (
    <section className="PopUpDefiAmi">
      <div onClick={onClose} ></div>
      <div>
        <div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M17.5 21.0001H6.5C5.11929 21.0001 4 19.8808 4 18.5001C4 14.4194 10 14.5001 12 14.5001C14 14.5001 20 14.4194 20 18.5001C20 19.8808 18.8807 21.0001 17.5 21.0001Z"
              stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
              stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Défier un ami</span>
        </div>
        <div>
          <input type="text" placeholder="Code du lobby #XXXX" value={lobbyCode} onChange={handleLobbyCodeChange} />
          <div>
            <button onClick={handleJoinLobby}>Rejoindre</button>
            <span>Lobby inconnu</span>
          </div>
          <button onClick={onCreateLobby}>Créer un lobby</button>
        </div>
        <svg onClick={onClose} className="close-btn" width="25" height="25" viewBox="0 0 25 25" fill="none">
          <path d="M25 2.63625L22.3638 0L12.5 9.86375L2.63625 0L0 2.63625L9.86375 12.5L0 22.3638L2.63625 25L12.5 15.1362L22.3638 25L25 22.3638L15.1362 12.5L25 2.63625Z" fill="#212121"/>
        </svg>
      </div>
    </section>
  );
};

export default PopUpDefiAmi;
