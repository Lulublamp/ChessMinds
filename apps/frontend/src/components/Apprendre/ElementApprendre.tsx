import React, { FC } from "react";

interface MouvPieceProps {
  avecImg: boolean;
  id: string;
  imgSrc?: string;
  imgAlt?: string;
  Titre: string;
  Text: string;
  Text2?: string;
}

const ElementApprendre: FC<MouvPieceProps> = ({ avecImg, id, imgSrc, imgAlt, Titre, Text, Text2 }) => {
    if (avecImg) {
        return (
            <div className="MouvPiece" id={id} >
                <img src={imgSrc} alt={imgAlt} />
                <div>
                    <h4>{Titre}</h4>
                    <p>{Text}</p>
                    <p>{Text2}</p>
                </div>
            </div>
          );
    }
    return (
        <div className="Cadre" id={id} >
            <div>
                <h4>{Titre}</h4>
                <p>{Text}</p>
                <p>{Text2}</p>
            </div>
        </div>
      );
};

export default ElementApprendre;
