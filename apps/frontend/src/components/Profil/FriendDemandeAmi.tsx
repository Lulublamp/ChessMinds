import React from 'react';
import ProfileImage from '../Logo_Icon/ProfileImage';

const FriendCardInvitation: React.FC = () => {
  return (
    <div>
      <ProfileImage id={0} />
      <span>Pseudo</span>
      <span>1000</span>
      <button>Accepter</button>
      <button>Refuser</button>
    </div>
  );
};

export default FriendCardInvitation;
