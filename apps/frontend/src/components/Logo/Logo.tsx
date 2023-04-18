import React from 'react';
import imageUrl from '../../images/logo.png'

interface LogoProps {
  width: number;
  height: number;
}

const Logo: React.FC<LogoProps> = ({ width, height }) => {

  return (
    <img
      src={imageUrl}
      alt="Logo ChessMinds"
      style={{
        width: width,
        height: height,
        objectFit: 'contain',
      }}
    />
  );
};

export default Logo;
