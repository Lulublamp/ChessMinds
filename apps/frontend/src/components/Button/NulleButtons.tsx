import React from "react";

interface NulleButtonProps {
  onClick: () => void;
}

const NulleButton: React.FC<NulleButtonProps> = ({ onClick }) => {
  return (
    <button
      style={{
        width: "223px",
        height: "52px",
        backgroundColor: "var(--couleur-caseNoir)",
        fontSize: "22px",
        fontWeight: "bold",
        color: "#fff",
        border: "none",
        borderRadius: "9px",
        cursor: "pointer",
        marginTop: "15px",
        boxShadow: "4px 4px 0px var(--font-color)"
      }}
      onClick={onClick}
    >
      Nulle
    </button>
  );
};

export default NulleButton;
