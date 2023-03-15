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
        backgroundColor: "#4465F2",
        fontSize: "22px",
        fontWeight: "bold",
        color: "#fff",
        border: "none",
        borderRadius: "9px",
        cursor: "pointer",
        marginTop: "15px",
      }}
      onClick={onClick}
    >
      Nulle
    </button>
  );
};

export default NulleButton;
