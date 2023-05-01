import React, {useContext} from "react";
import ProfileImage from "../Logo_Icon/ProfileImage";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { UserContext } from '../UserContext';

interface Props {
  onIconClick: () => void;
  handleUpdateIconId: (iconId: number) => void;
}

const ProfileIconChoices: React.FC<Props> = ({ onIconClick, handleUpdateIconId }) => {
  const user = useContext(UserContext);
  const icons = [
    "IconPlayer1.png",
    "IconPlayer2.png",
    "IconPlayer3.png",
    "IconPlayer4.png",
    "IconPlayer5.png",
    "IconPlayer6.png",
    "IconPlayer7.png",
    "IconPlayer8.png",
  ];

  const updateIconId = async (iconId : number) => {
    if (user && user.user) {
      try {
        const id = user.user?.id;
        const response = await axios.put(`${API_BASE_URL}/joueurs/updateIcon/${id}`, {
          nouvelIconId: iconId,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        //console.log("ID de l'icône mis à jour avec succès:", response.data, iconId);
        onIconClick();
        handleUpdateIconId(iconId);
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'ID de l'icône:", error);
      }
    }
    else {
      console.error("Erreur lors de la mise à jour de l'ID de l'icône: user n'est pas défini");
    }
  };

  return (
    <div className="ProfilIconChoices">
      {icons.map((icon, index) => (
        <ProfileImage id={index} key={index} alt={`Icon Player ${index + 1}`} onclick={() => updateIconId(index)}/>
      ))}
    </div>
  );;
};

export default ProfileIconChoices;
