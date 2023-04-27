import React, { useState } from 'react';
import './PopUpAddFriend.css';

interface Props {
  closePopUp: () => void;
}

const PopUpAddFriend: React.FC<Props> = ({ closePopUp }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    // Code pour envoyer la demande d'ami
  };

  return (
    <div className="PopUpAddFriend">
      <div onClick={closePopUp}></div>
      <div>
        <div>
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
            <path
              d="M14.5 19.0001H3.5C2.11929 19.0001 1 17.8808 1 16.5001C1 12.4194 7 12.5001 9 12.5001C11 12.5001 17 12.4194 17 16.5001C17 17.8808 15.8807 19.0001 14.5 19.0001Z"
              stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M9 9C11.2091 9 13 7.20914 13 5C13 2.79086 11.2091 1 9 1C6.79086 1 5 2.79086 5 5C5 7.20914 6.79086 9 9 9Z"
              stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3>Envoyer une demande d’ami</h3>
        </div>
        <input
          type="text"
          placeholder="Entrez une adresse mail ou un pseudo"
          value={inputValue}
          onChange={handleInputChange}
        />
        <div>
          <span className="success">Demande envoyée</span>
          <button onClick={handleSubmit}>Envoyer</button>
        </div>
        <svg onClick={closePopUp} className="close-btn" width="25" height="25" viewBox="0 0 25 25" fill="none">
          <path d="M25 2.63625L22.3638 0L12.5 9.86375L2.63625 0L0 2.63625L9.86375 12.5L0 22.3638L2.63625 25L12.5 15.1362L22.3638 25L25 22.3638L15.1362 12.5L25 2.63625Z" fill="#212121" />
        </svg>
      </div>
    </div>
  );
};

export default PopUpAddFriend;
