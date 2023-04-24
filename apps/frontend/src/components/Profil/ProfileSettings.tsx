import React from "react";
import ProfileImage from "../Logo_Icon/ProfileImage";

interface Props {
  onIconClick: () => void;
}

const ProfileSettings: React.FC<Props> = ({ onIconClick }) => {
  return (
    <div>
      <div>
        <ProfileImage id={0}/>
        <button onClick={onIconClick}>Modifier</button>
      </div>
      <div>
        <div>
          <input type="text" defaultValue="Pseudo" />
          <button>Modifier</button>
        </div>
        <div>
          <input type="email" defaultValue="user@gmail.com" />
          <button>Modifier</button>
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
