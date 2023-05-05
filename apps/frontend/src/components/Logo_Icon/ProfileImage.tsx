import React from "react";
import iconPlayer1 from "../../images/ProfilIcon/IconPlayer1.png";
import iconPlayer2 from "../../images/ProfilIcon/IconPlayer2.png";
import iconPlayer3 from "../../images/ProfilIcon/IconPlayer3.png";
import iconPlayer4 from "../../images/ProfilIcon/IconPlayer4.png";
import iconPlayer5 from "../../images/ProfilIcon/IconPlayer5.png";
import iconPlayer6 from "../../images/ProfilIcon/IconPlayer6.png";
import iconPlayer7 from "../../images/ProfilIcon/IconPlayer7.png";
import iconPlayer8 from "../../images/ProfilIcon/IconPlayer8.png";
import iconAi from "../../images/ProfilIcon/IconAi.png";

interface Props {
  id: number;
  alt?: string;
  className?: string;
  onclick?: () => void;
}

const ProfileImage: React.FC<Props> = ({ id, alt, className,onclick }) => {
  const images = [
    iconPlayer1,
    iconPlayer2,
    iconPlayer3,
    iconPlayer4,
    iconPlayer5,
    iconPlayer6,
    iconPlayer7,
    iconPlayer8,
    iconAi,
  ];

  return <img src={images[id]} alt={alt || `Icon Player ${id + 1}`} className={className} onClick={onclick} />;
};

export default ProfileImage;
