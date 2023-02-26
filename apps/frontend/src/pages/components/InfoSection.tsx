import React from 'react';

function InfoSection() {
  return (
    <section className="info">
      <div>
          <div>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M25 10V17.5M21.25 13.75H28.75M8.125 26.2501H21.875C23.6009 26.2501 25 24.851 25 23.1251C25 18.0242 17.5 18.1251 15 18.1251C12.5 18.1251 5 18.0242 5 23.1251C5 24.851 6.39911 26.2501 8.125 26.2501ZM20 8.75C20 11.5114 17.7614 13.75 15 13.75C12.2386 13.75 10 11.5114 10 8.75C10 5.98858 12.2386 3.75 15 3.75C17.7614 3.75 20 5.98858 20 8.75Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
          </div>
          <span>Invitez vos amis !</span>  
      </div>
      <div>
          <p>
              Des parties d'échecs en temps réel avec des joueurs du monde entier !
          </p>
          <span></span>
      </div>
    </section>
  );
}

export default InfoSection;
