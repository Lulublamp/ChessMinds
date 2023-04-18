import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="cards">
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
};

export default Card;
