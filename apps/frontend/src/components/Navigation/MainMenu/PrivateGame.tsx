/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext, useRef } from "react";
import "./stylePrivateGame.css";
import ReadySwitch from "./ReadySwitch";
import PlayButton from "../../Button/PlayButton";
import FriendsList from "../../Profil/FriendsList";
import TimeMode from "./TimeMode";
import {
  IMMPlayer,
  MATCHMAKING_MODES_TIMERS,
  PGinvitations,
  ReactSetter,
  eILeaveLobbyEvent,
} from "@TRPI/core/core-network";
import { useGlobalSocket } from "../../../contexts/ContextPublicManager";
import { UserContext } from "../../UserContext";
import { set } from "lodash";
import { useNavigate } from "react-router-dom";

interface Props {
  onBackClick: () => void;
  lstIdInvitations: number[];
  InvitationSetteur: ReactSetter<PGinvitations[]>;
  isHost: boolean;
  goToPrivateGame: () => void;
  invitationLobbyId: string;
}

const PrivateGame: React.FC<Props> = ({
  onBackClick,
  lstIdInvitations,
  InvitationSetteur,
  isHost,
  goToPrivateGame,
  invitationLobbyId,
}) => {
  const [selectedTimeMod, setSelectedTimeMod] =
    useState<MATCHMAKING_MODES_TIMERS>("bullet");
  const [isReady, setisReady] = useState<string>("unready");
  const globalSocket = useGlobalSocket();
  const user = useContext(UserContext);

  const [lobbyId, setLobbyId] = useState<string | null>(null);

  const [lobby, setLobby] = useState<IMMPlayer[]>([]);
  const lobbyRef = React.useRef<IMMPlayer[]>([]);

  const isMounted = useRef(false);

  const [readyArray, setReadyArray] = useState<[boolean, boolean]>([
    false,
    false,
  ]);

  const [checked, setChecked] = useState(false);

  const navigate = useNavigate();

  const isHostCleanUp = () => {
    console.log("Private game interface disappeared ! clean up");
    globalSocket?.offListenToLobbyCreated();
    globalSocket?.offListenToJoinLobby();
    globalSocket?.offListenToLobbyLeave();
    globalSocket?.offListenToReadySwitched();
    globalSocket?.offListenToPGStarting();
    globalSocket?.offListenToLinking();
    setReadyArray([false, false]);
    setChecked(false);
  };

  const navigateToGame = (lobbyId: string) => {
    console.log("navigate to game in private games");
    console.log("lobbyId : ", lobbyId);
    navigate(`/Game?id=${lobbyId}`);
  };

  const lobbyIdCleanUp = (id: string) => {
    globalSocket?.leaveLobby({
      lobbyId: id,
      isHost: isHost,
    });
    setLobby([]);
    setLobbyId(null);
  };

  const handleTimeModeSelect = (timeMode: MATCHMAKING_MODES_TIMERS) => {
    setSelectedTimeMod(timeMode);
  };

  const handleReadyChange = (checked: string) => {
    setisReady(checked);
  };

  /*                                isHost                                        */
  //Ce useEffect gère le host
  useEffect(() => {
    console.log("Private game interface appeared !");
    if (!isHost) return;
    console.log("isHost : ", isHost);
    globalSocket?.listenToLobbyCreated({ setLobbyId });
    globalSocket?.createLobby(null);
  }, [isHost]);
  //Ce useEffect gère le non host
  useEffect(() => {
    if (isHost) return;
    console.log("isHost : ", isHost);
  }, [isHost]);
  //Ce useEffect gère l'apparition dans le lobby
  useEffect(() => {
    console.log("Current array ", readyArray);
  }, [readyArray]);

  useEffect(() => {
    globalSocket?.listenToJoinLobby({
      goToPrivateGame,
      Settlobby: setLobby,
      lobbyRef: lobbyRef,
      userId: Number(user.user!.id),
      setReadyArray,
      setChecked,
      onReadyChange: handleReadyChange,
      isHost: isHost,
    });

    globalSocket?.listenToLobbyLeave({
      callback: onBackClick,
      lobby: lobby,
      setLobby: setLobby,
    });

    globalSocket?.listenToReadySwitched({
      readyArray: readyArray,
      setReadyArray: setReadyArray,
    });

    globalSocket?.listenToPGStarting({
      navigateToGame,
    });

    globalSocket?.listenToLinking({});

    return () => isHostCleanUp();
  }, [isHost]);
  /*                                isHost                                        */

  //Ce useEffect gère la sortie du lobby
  useEffect(() => {
    if (lobbyId) {
      return () => lobbyIdCleanUp(lobbyId);
    } else if (invitationLobbyId) {
      return () => lobbyIdCleanUp(invitationLobbyId);
    }
  }, [lobbyId, invitationLobbyId]);

  useEffect(() => {
    if (!lobbyId && !invitationLobbyId) return;
    if (!isMounted.current && !isHost) {
      isMounted.current = true;
      return;
    }
    if (isReady == "reset") return;

    globalSocket?.sendSwitchReady({
      lobbyId: lobbyId ? lobbyId : invitationLobbyId!,
    });
  }, [isReady]);

  const handleDefi = (id: number) => {
    globalSocket?.sendPGinvitation({ idInvite: id, lobbyId: lobbyId! });
    console.log("defi", id);
  };

  // useEffect(() => {

  //   console.log('isHost changed in private game yeah ! : ', isHost);

  //   globalSocket?.listenToLobbyLeave({
  //     callback: onBackClick,
  //     lobby: Lobby,
  //     setLobby: LobbySetteur,
  //   });

  //   globalSocket?.listenToReadySwitched({
  //     readyArray: readyArray,
  //     setReadyArray: setReadyArray,
  //   });

  //   if (!isHost) {
  //     console.log('Joining server lobby', idMatch);
  //     InvitationSetteur((prevState) =>
  //       prevState.filter((invitation) => invitation.lobbyId !== idMatch)
  //     );
  //     return;
  //   };
  // }, [isHost]);

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
            <div className="Lobby">
              <h3>Lobby :</h3>
              <div>
                <svg width="21" height="18" viewBox="0 0 21 18" fill="none">
                  <path
                    d="M10.125 4.5L13.5 10.35L16.875 7.3125L16.0875 11.25H4.1625L3.375 7.3125L6.75 10.35L10.125 4.5ZM10.125 0L6.1875 6.75L0 1.125L2.25 13.5H18L20.25 1.125L14.0625 6.75L10.125 0ZM18 15.75H2.25V16.875C2.25 17.55 2.7 18 3.375 18H16.875C17.55 18 18 17.55 18 16.875V15.75Z"
                    fill="#212121"
                  />
                </svg>
                <span>
                  {lobby.length >= 1 ? lobby[0].name : user.user?.pseudo}
                </span>
                {readyArray[0] ? (
                  <span className="ready">Prêt</span>
                ) : (
                  <span className="notready">Pas prêt</span>
                )}
              </div>
              {lobby && lobby.length >= 2 && (
                <div>
                  <span>{lobby[1].name}</span>
                  {readyArray[1] ? (
                    <span className="ready">Prêt</span>
                  ) : (
                    <span className="notready">Pas prêt</span>
                  )}
                </div>
              )}
            </div>
            <ReadySwitch
              onReadyChange={handleReadyChange}
              checked={checked}
              setChecked={setChecked}
            />
            {isHost && <TimeMode onTimeModeSelect={handleTimeModeSelect} />}
            {isHost && readyArray[0] && readyArray[1] && (
              <PlayButton
                selectedTimeMod={selectedTimeMod}
                isRanked={"private"}
                lobbyId={lobbyId!}
              />
            )}
          </div>
        </div>
        {isHost && (
          <FriendsList
            lstIdInvitations={lstIdInvitations}
            defiMode={true}
            onDefi={handleDefi}
          />
        )}
      </div>
    </section>
  );
};

export default PrivateGame;
