import React, { useState } from "react";
import "./PopupModifProfil.css";
import ProfileSettings from "./ProfileSettings";
import ProfileIconChoices from "./ProfileIconChoices";

interface Props {
  togglePopup : () => void;
  iconId: number;
  handleUpdateIconId: (iconId: number) => void;
}

const PopupModifProfil: React.FC<Props> = ({togglePopup, iconId, handleUpdateIconId}) => {
  const [isIconChoicesOpen, setIsIconChoicesOpen] = useState(false);

  const openIconChoices = () => {
    setIsIconChoicesOpen(true);
  };

  const closeIconChoices = () => {
    setIsIconChoicesOpen(false);
  };

  return (
    <div className="PopupModifProfil">
      <div></div>
      <div>
        <h2>Modification de votre profil</h2>
        {!isIconChoicesOpen && <ProfileSettings onIconClick={openIconChoices} iconId={iconId} />}
        {isIconChoicesOpen && <ProfileIconChoices onIconClick={closeIconChoices} handleUpdateIconId={handleUpdateIconId} />}
        <svg className="closePopup" width="25" height="25" viewBox="0 0 25 25" fill="none" onClick={togglePopup}>
          <path d="M25 2.63625L22.3638 0L12.5 9.86375L2.63625 0L0 2.63625L9.86375 12.5L0 22.3638L2.63625 25L12.5 15.1362L22.3638 25L25 22.3638L15.1362 12.5L25 2.63625Z" fill="#212121" />
        </svg>
      </div>
    </div>
  );
};

export default PopupModifProfil;
