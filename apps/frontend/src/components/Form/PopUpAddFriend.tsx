import React, { useContext, useEffect, useState } from 'react';
import './PopUpAddFriend.css';
import { useGlobalSocket } from '../../contexts/ContextPublicManager';
import { UserContext } from '../UserContext';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

interface Props {
  closePopUp: () => void;
}

const PopUpAddFriend: React.FC<Props> = ({ closePopUp }) => {

  const [inputValue, setInputValue] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusClass, setStatusClass] = useState('');
  const Globalsocket = useGlobalSocket();
  const user = useContext(UserContext);

  useEffect(() => {
    console.log("Globalsocket: ", Globalsocket);
    if (Globalsocket === null) return;
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const findIdPlayer = async (pseudo: string, email: string): Promise<number> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/joueurs/TrouverJoueur?pseudo=${pseudo}&email=${email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.data) {
        console.log("Player Found");
        return response.data;
      } else {
        console.log("Player Not Found");
        return -1;
      }
    } catch (error) {
      console.log(error);
      return -1;
    }
  };
  
  const handleSubmit = async () => {
    if (inputValue === "") {
      setStatusMessage("Veuillez entrer un pseudo ou une adresse mail");
      setStatusClass("error");
      return;
    }
    if(inputValue === user.user?.pseudo){
      setStatusMessage("Vous ne pouvez pas vous ajouter vous-même");
      setStatusClass("error");
      return;
    }
    let idJoueurInvite = await findIdPlayer(inputValue, inputValue);
    if (idJoueurInvite === undefined || idJoueurInvite === -1) {
      setStatusMessage("Joueur non trouvé");
      setStatusClass("error");
      return;
    }
    console.log("idJoueurInvite: ", idJoueurInvite);
    Globalsocket!.sendFriendInvitations({
      idInvite: idJoueurInvite,
    })
    // Globalsocket!.SendInvite({ idJoueur: Number(user.user?.id!), idJoueurInvite: idJoueurInvite });
    setStatusMessage("Demande d'ami simulé");
    setStatusClass("success");
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
          <span className={statusClass}>{statusMessage}</span>
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
