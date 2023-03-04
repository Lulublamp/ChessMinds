import React from 'react';
import "./NavBarStyle.css"
import logo from '../images/logo.png';


function Navbar() {
  return (
    <nav className="navbar">
      <img src={logo} alt="Logo"/>
      <div>
        <a>Jouer</a>
        <a>Apprendre</a>
        <a>Regarder</a>
        <a>Classement</a>
      </div>
      <div>
        <svg width="22" height="25" viewBox="0 0 22 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.875 23.5001H4.125C2.39911 23.5001 1 22.101 1 20.3751C1 15.2742 8.5 15.3751 11 15.3751C13.5 15.3751 21 15.2742 21 20.3751C21 22.101 19.6009 23.5001 17.875 23.5001Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11 11C13.7614 11 16 8.76142 16 6C16 3.23858 13.7614 1 11 1C8.23858 1 6 3.23858 6 6C6 8.76142 8.23858 11 11 11Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <a>Join Us</a>                
      </div>
    </nav>
  );
}

export default Navbar;
