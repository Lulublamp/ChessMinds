import React from 'react';

function MainMenu() {
  return (
    <nav className="menuPrincipale">
      <ul>
        <li><button>Nouvelle partie</button></li>
        <li><button>Vs l'ordinateur</button></li>
        <li><button>Jouer avec un ami</button></li>
        <li><button>Apprendre</button></li>
      </ul>
    </nav>
  );
}

export default MainMenu;
