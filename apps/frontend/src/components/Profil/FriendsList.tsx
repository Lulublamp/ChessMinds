import React from 'react';
import FriendCard from './FriendCard';

const FriendsList: React.FC = () => {
  return (
    <div className="FriendsList">
      <span>Amis (122)</span>
      <div>
        {/* You can map over friends data and render FriendCard components */}
        <FriendCard />
        <FriendCard />
        <FriendCard />
      </div>
    </div>
  );
};

export default FriendsList;
