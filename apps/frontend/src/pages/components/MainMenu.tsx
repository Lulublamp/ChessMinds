import React from 'react';
import { Link } from 'react-router-dom';

function MainMenu() {
  return (
    <nav className="menuPrincipale">
      <ul>
        <li><button>Nouvelle partie</button></li>
        <li><button>Vs l'ordinateur</button></li>
        <li><button>Jouer avec un ami</button></li>
        <li><button>Apprendre</button></li>
        <li><Link to={'/test'}>test reseau</Link></li>
      </ul>
    </nav>
  );
}

export default MainMenu;
