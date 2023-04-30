import React, { useContext, useState } from "react";
import ProfileImage from "../Logo_Icon/ProfileImage";
import { UserContext } from '../UserContext';
import axios from "axios";
import { API_BASE_URL } from "../../config";

interface Props {
  onIconClick: () => void;
}

const ProfileSettings: React.FC<Props> = ({ onIconClick }) => {
  const user = useContext(UserContext);
  const [pseudo, setPseudo] = useState(user?.user?.pseudo || "");
  const [email, setEmail] = useState(user?.user?.email || "");
  const [iconId, setIconId] = useState(0);


  const handlePseudoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPseudo(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const updatePseudo = async () => {
    if (user && user.user) {
      try {
        const id = user.user?.id;
        const response = await axios.put(`${API_BASE_URL}/joueurs/updatePseudo/${id}`, {
          nouveauPseudo: pseudo,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        console.log("Pseudo mis à jour avec succès:", response.data);
        if (response.data.pseudo) {
          user.setUser({
            ...user.user,
            pseudo: response.data.pseudo,
          });
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du pseudo:", error);
      }
    }
    else {
      console.error("Erreur lors de la mise à jour du pseudo: user n'est pas défini");
    }
  };

  const updateEmail = async () => {
    if (user && user.user) {
      try {
        const id = user.user?.id;
        const response = await axios.put(`${API_BASE_URL}/joueurs/updateEmail/${id}`, {
          nouveauEmail: email,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        console.log("Email mis à jour avec succès:", response.data);
        if (response.data.email) {
          user.setUser({
            ...user.user,
            email: response.data.email,
          });
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'email:", error);
      }
    }
    else {
      console.error("Erreur lors de la mise à jour de l'email: user n'est pas défini");
    }
  };

  return (
    <div>
      <div>
        <ProfileImage id={iconId} />
        <button onClick={onIconClick}>Modifier</button>
      </div>
      <div>
        <div>
          <input type="text" value={pseudo} onChange={handlePseudoChange} />
          <button onClick={updatePseudo}>Modifier</button>
        </div>
        <div>
          <input type="email" value={email} onChange={handleEmailChange} />
          <button onClick={updateEmail}>Modifier</button>
        </div>
        <div>
          <input type="password" defaultValue="Mot de passe" />
          <button>Modifier</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
