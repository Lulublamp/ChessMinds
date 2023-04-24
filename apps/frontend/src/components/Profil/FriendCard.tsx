import React from 'react';
import ProfileImage from '../Logo_Icon/ProfileImage';

const FriendCard: React.FC = () => {
  return (
    <div>
      <ProfileImage id={0} />
      <span>Pseudo</span>
      <span>1000</span>
      <button>View Profil</button>
    </div>
  );
};

export default FriendCard;
