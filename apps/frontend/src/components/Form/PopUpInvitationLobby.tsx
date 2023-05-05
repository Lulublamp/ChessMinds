import React, { FC } from 'react';
import './PopUpInvitationLobby.css';
import { PGinvitations } from '@TRPI/core/core-network';

interface PopUpInvitationLobbyProps {
  invitation: PGinvitations;
  onAccept: () => void;
  onDecline: () => void;
}

const PopUpInvitationLobby: FC<PopUpInvitationLobbyProps> = ({ invitation, onAccept, onDecline }) => {
  return (
    <div className="PopUpInvitationLobby">
      <span>{invitation.pseudo} T’a défié(e) ! ⚔️</span>
      <div>
        <button onClick={onAccept}>Accepter</button>
        <button onClick={onDecline}>Refuser</button>
      </div>
    </div>
  );
};

export default PopUpInvitationLobby;
