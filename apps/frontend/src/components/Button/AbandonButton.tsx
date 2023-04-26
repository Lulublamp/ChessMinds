import React from "react";

interface AbandonButtonProps {
  onClick: () => void;
}

const AbandonButton: React.FC<AbandonButtonProps> = ({ onClick }) => {
  return (
    <button
      style={{
        width: "223px",
        height: "52px",
        backgroundColor: "#E63946",
        fontSize: "22px",
        fontWeight: "bold",
        color: "#fff",
        border: "none",
        borderRadius: "9px",
        cursor: "pointer",
        marginTop: "50px",
        boxShadow: "4px 4px 0px var(--font-color)"
      }}
      onClick={onClick}
    >
      Abandonner
    </button>
  );
};

export default AbandonButton;
