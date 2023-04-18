import React from 'react';
import iconPlayer from "../../images/IconPlayer.png";

const FriendCard: React.FC = () => {
  return (
    <div>
      <img src={iconPlayer} alt="Avatar" />
      <span>Pseudo</span>
      <span>1000</span>
      <button>View Profil</button>
    </div>
  );
};

export default FriendCard;
