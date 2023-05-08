import React, { useContext, useState } from "react";
import ProfileImage from "../Logo_Icon/ProfileImage";
import { UserContext } from '../UserContext';
import axios from "axios";
import { API_BASE_URL } from "../../config";

interface Props {
  onIconClick: () => void;
  iconId: number;
}

const ProfileSettings: React.FC<Props> = ({ onIconClick, iconId }) => {
  const user = useContext(UserContext);
  const [pseudo, setPseudo] = useState(user?.user?.pseudo || "");
  const [email, setEmail] = useState(user?.user?.email || "");
  const [statut, setStatut] = useState("");
  const [success, setSuccess] = useState(false);


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
          setStatut("Pseudo mis à jour avec succès");
          setSuccess(true);
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du pseudo:", error);
        setStatut("Erreur lors de la mise à jour du pseudo");
        setSuccess(false);
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
        setStatut("Email mis à jour avec succès");
        setSuccess(true);
        if (response.data.adresseMail) {
          user.setUser({
            ...user.user,
            email: response.data.adresseMail,
          });
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'email:", error);
        setStatut("Erreur lors de la mise à jour de l'email");
        setSuccess(false);
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
        <span className={success ? 'success' : 'error'} >{statut}</span>
      </div>
    </div>
  );
};

export default ProfileSettings;
