import React from "react";
import ProfileImage from "../Logo_Icon/ProfileImage";

interface Props {
  onIconClick: () => void;
}

const ProfileIconChoices: React.FC<Props> = ({ onIconClick }) => {
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

  return (
    <div className="ProfilIconChoices">
      {icons.map((icon, index) => (
        <ProfileImage id={index}  alt="Icon Player ${index + 1}" onclick={onIconClick}/>
      ))}
    </div>
  );
};

export default ProfileIconChoices;
