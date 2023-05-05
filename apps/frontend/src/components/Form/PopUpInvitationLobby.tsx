import React, { FC } from 'react';
import './PopUpInvitationLobby.css';

interface PopUpInvitationLobbyProps {
  challengerPseudo: string;
  onAccept: () => void;
  onDecline: () => void;
}

const PopUpInvitationLobby: FC<PopUpInvitationLobbyProps> = ({ challengerPseudo, onAccept, onDecline }) => {
  return (
    <div className="PopUpInvitationLobby">
      <span>{challengerPseudo} T’a défié(e) ! ⚔️</span>
      <div>
        <button onClick={onAccept}>Accepter</button>
        <button onClick={onDecline}>Refuser</button>
      </div>
    </div>
  );
};

export default PopUpInvitationLobby;
