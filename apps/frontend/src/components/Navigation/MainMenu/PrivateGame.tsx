import React, { useState, useEffect, useContext } from 'react';
import './stylePrivateGame.css';
import ReadySwitch from './ReadySwitch';
import PlayButton from '../../Button/PlayButton';
import FriendsList from '../../Profil/FriendsList';
import TimeMode from './TimeMode';
import { IMMPlayer, MATCHMAKING_MODES_TIMERS, PGinvitations, ReactSetter, eILeaveLobbyEvent } from '@TRPI/core/core-network';
import { useGlobalSocket } from '../../../contexts/ContextPublicManager';
import { UserContext } from '../../UserContext';

interface Props {
  onBackClick: () => void;
  lstIdInvitations: number[];
  idMatch: string | null;
  Lobby: IMMPlayer[];
  LobbySetteur: ReactSetter<IMMPlayer[]>;
  InvitationSetteur: ReactSetter<PGinvitations[]>;
}

const PrivateGame: React.FC<Props> = ({ onBackClick, lstIdInvitations, idMatch, Lobby, LobbySetteur, InvitationSetteur }) => {
  const [selectedTimeMod, setSelectedTimeMod] = useState<MATCHMAKING_MODES_TIMERS>('bullet');
  const [isReady, setisReady] = useState<string>('unready');
  const globalSocket = useGlobalSocket();
  const user = useContext(UserContext)
  const matchId = `${globalSocket!['socket'].id}-${user.user?.id}`

  const [readyArray, setReadyArray] = useState<[boolean , boolean]>([false , false]);

  const handleTimeModeSelect = (timeMode: MATCHMAKING_MODES_TIMERS) => {
    setSelectedTimeMod(timeMode);
  };

  const handleReadyChange = (checked: string) => {
    setisReady(checked);
    console.log('A:' + idMatch)
    console.log('B:' + matchId)
    globalSocket?.sendSwitchReady({lobbyId: idMatch ? idMatch : matchId})
  };

  const handleDefi = (id: number) => {
    globalSocket?.sendPGinvitation({ idInvite: id, lobbyId: matchId })
    console.log('defi', id);

  };

  const isHost = () => {
    console.log('Creating server lobby');
    globalSocket?.createLobby(null);
    console.log(matchId)
  }

  useEffect(() => {
    console.log('LOBBY HAS CHANGED BORDEL', Lobby);
  },[Lobby]);

  useEffect(() => {
    if (!idMatch) isHost();
    else {
      console.log('Joining server lobby', idMatch);
      InvitationSetteur((prevState) =>
        prevState.filter((invitation) => invitation.lobbyId !== idMatch)
      );
    }
    globalSocket?.listenToLobbyLeave({
      callback: onBackClick,
      lobby: Lobby,
      setLobby: LobbySetteur,
    });

    globalSocket?.listenToReadySwitched({
      readyArray: readyArray,
      setReadyArray: setReadyArray,
    });
    console.log('lobby', Lobby);
    return () => {
      if (!idMatch) {
        console.log('Destroying server lobby');
        //globalSocket?.deleteLobby(null);
      }
      else {
        console.log('Leaving server lobby');
        //globalSocket?.leaveLobby(null);
      }
      //globalSocket?.leaveLobby(payload);

      LobbySetteur([]);
    }
  }, []);

  return (
    <section className="PrivateLobby">
      <div>
        <div className="left-container">
          <span onClick={onBackClick}>Quitter</span>
          <div className="cta-box">
            <div className="icon"></div>
            <span className="text">Défier un ami</span>
          </div>
          <div className="menu-container">
            <div className='Lobby'>
              <h3>Lobby :</h3>
              <div>
                <svg width="21" height="18" viewBox="0 0 21 18" fill="none">
                  <path d="M10.125 4.5L13.5 10.35L16.875 7.3125L16.0875 11.25H4.1625L3.375 7.3125L6.75 10.35L10.125 4.5ZM10.125 0L6.1875 6.75L0 1.125L2.25 13.5H18L20.25 1.125L14.0625 6.75L10.125 0ZM18 15.75H2.25V16.875C2.25 17.55 2.7 18 3.375 18H16.875C17.55 18 18 17.55 18 16.875V15.75Z" fill="#212121" />
                </svg>
                <span>{Lobby.length >= 1 ? Lobby[0].name : user.user?.pseudo}</span>
                <span className='ready'>Prêt</span>
              </div>
              {
                Lobby && Lobby.length >= 2 && <div>
                  <span>{Lobby[1].name}</span>
                  <span className='notready'>Pas prêt</span>
                </div>
              }
            </div>
            <ReadySwitch onReadyChange={handleReadyChange} />
            <TimeMode onTimeModeSelect={handleTimeModeSelect} />
            <PlayButton selectedTimeMod={selectedTimeMod} isRanked={'private'} />
          </div>
        </div>
        <FriendsList lstIdInvitations={lstIdInvitations} defiMode={true} onDefi={handleDefi} />
      </div>
    </section>
  );
};

export default PrivateGame;