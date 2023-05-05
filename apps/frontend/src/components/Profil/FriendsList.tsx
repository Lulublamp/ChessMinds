import React, { useEffect, useState } from 'react';
import FriendCard from './FriendCard';
import FriendCardInvitation from './FriendDemandeAmi';
import PopUpAddFriend from '../Form/PopUpAddFriend';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import './FriendList.css'

interface FriendProps {
  lstIdInvitations: number[];
  defiMode: boolean;
  onDefi?: (id: number) => void;
}

const FriendsList: React.FC<FriendProps> = ({ lstIdInvitations, defiMode, onDefi }) => {

  const [showPopUp, setShowPopUp] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [lstFriends, setLstFriends] = useState([]);

  const handleAddFriendClick = () => {
    setShowPopUp(!showPopUp);
  };

  const handleInvitationClick = () => {
    setShowInvitation(true);
  };

  const handleFriendClick = () => {
    setShowInvitation(false);
  };
  
  const handleGetFriends = async () => {
    try{
      const response = await axios.get(`${API_BASE_URL}/joueurs/Getfriends`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setLstFriends(response.data);
    }catch(error){
      console.log(error);
    }
  };

  useEffect(() => {
    console.log('lstIdInvitations', lstIdInvitations);
    handleGetFriends();
  }, []);

  return (
    <>
      <div className="FriendsList">
        <div>
          <span onClick={handleFriendClick}>Amis (122)</span>
          <div>
            <div>
              <svg width="35" height="35" viewBox="0 0 35 35" fill="none" onClick={handleInvitationClick}>
                <path d="M30.6252 16.0417C30.6252 13.9583 33.5418 13.9583 33.5418 11.7803C33.5418 10.1067 32.2618 8.75 30.6252 8.75C29.2444 8.75 28.0375 9.71574 27.7085 11.0227M30.6252 18.9584V18.9729M9.47933 30.6252H25.521C27.5345 30.6252 29.1668 28.9929 29.1668 26.9793C29.1668 21.0282 20.4168 21.146 17.5002 21.146C14.5835 21.146 5.8335 21.0282 5.8335 26.9793C5.8335 28.9929 7.46579 30.6252 9.47933 30.6252ZM23.3335 10.2083C23.3335 13.43 20.7218 16.0417 17.5002 16.0417C14.2785 16.0417 11.6668 13.43 11.6668 10.2083C11.6668 6.98667 14.2785 4.375 17.5002 4.375C20.7218 4.375 23.3335 6.98667 23.3335 10.2083Z" stroke="#212121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {
                lstIdInvitations.length > 0 && (
                  <span>{lstIdInvitations.length}</span>
                )
              }
            </div>
            <svg onClick={handleAddFriendClick} width="35" height="35" viewBox="0 0 35 35" fill="none">
              <path d="M29.1668 11.6667V20.4167M24.7918 16.0417H33.5418M9.47933 30.6252H25.521C27.5345 30.6252 29.1668 28.9929 29.1668 26.9793C29.1668 21.0282 20.4168 21.146 17.5002 21.146C14.5835 21.146 5.8335 21.0282 5.8335 26.9793C5.8335 28.9929 7.46579 30.6252 9.47933 30.6252ZM23.3335 10.2083C23.3335 13.43 20.7218 16.0417 17.5002 16.0417C14.2785 16.0417 11.6668 13.43 11.6668 10.2083C11.6668 6.98667 14.2785 4.375 17.5002 4.375C20.7218 4.375 23.3335 6.98667 23.3335 10.2083Z" stroke="#212121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        {showInvitation && (
          <div className='InvitationContainer'>
            {lstIdInvitations.map(id => (
              <FriendCardInvitation key={id} idJoueur={id} />
            ))}
          </div>
        )}
        {!showInvitation && (
          <div>
            {lstFriends.map((friend: any,index) => (
              <FriendCard key={index} idJoueur={friend} defiMode={defiMode} handleDefiClick={onDefi} />
            ))}
          </div>
        )}
      </div>
      {showPopUp && <PopUpAddFriend closePopUp={handleAddFriendClick} />}
    </>
  );
};

export default FriendsList;
