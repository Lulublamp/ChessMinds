import React, { FC } from "react";

interface ButtonProps {
  id: string;
  imgSrc: string;
  imgAlt: string;
  spanText: string;
  imgHeight?: string;
  click?: () => void;
}

const MenuButton: FC<ButtonProps> = ({ id, imgSrc, imgAlt, spanText, imgHeight, click }) => {
  return (
    <button id={id} onClick={click}>
      <img src={imgSrc} alt={imgAlt} height={imgHeight} width="auto" />
      <span>{spanText}</span>
    </button>
  );
};

export default MenuButton;