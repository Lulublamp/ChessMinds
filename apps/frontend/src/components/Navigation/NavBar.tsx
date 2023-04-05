import React from 'react';
import "./NavBarStyle.css";
import Logo from '../Logo_Icon/Logo';
import Connexion from './Connexion';
import Inscription from './Inscription';
import MDPOublie from './MDPOublie';



function Navbar() {
  const [showConnexion, setShowConnexion] = React.useState(false);
  const [showInscription, setShowInscription] = React.useState(false);
  const [showMDPOublie, setShowMDPOublie] = React.useState(false);
  const [UserConnecter, setUserConnecter] = React.useState(true);

  const UserCoDeco = () => {
    setUserConnecter(!UserConnecter);
  };

  const OpenPopupConnexion = () => {
    setShowConnexion(true);
  };
  const ClosePopupConnexion = () => {
    setShowConnexion(false);
  };

  const ClosePopupInscription = () => {
    setShowInscription(false);
  };

  const ClosePopupMDPOublie = () => {
    setShowMDPOublie(false);
  };

  const ChangeInscriptionToConnexion = () => {
    setShowInscription(false);
    setShowConnexion(true);
  };
  const ChangeConnexionToInscription = () => {
    setShowInscription(true);
    setShowConnexion(false);
  };

  const ChangeConnexionToMDPOublie = () => {
    setShowMDPOublie(true);
    setShowConnexion(false);
  };
  const ChangeMDPOublieToConnexion = () => {
    setShowMDPOublie(false);
    setShowConnexion(true);
  };

  const ChangeMDPOublieToInscription = () => {
    setShowMDPOublie(false);
    setShowInscription(true);
  };

  const ConnecterNav = 
  <div className='Connecter'>
    <svg width="22" height="25" viewBox="0 0 22 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.0019 24.1049L4.25192 24.1031C2.52603 24.1029 1.1271 22.7036 1.12733 20.9777C1.128 15.8767 8.62799 15.9787 11.128 15.979C13.628 15.9793 21.128 15.8794 21.1273 20.9803C21.1271 22.7062 19.7278 24.1051 18.0019 24.1049Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M11.1286 11.6039C13.89 11.6042 16.1289 9.36594 16.1292 6.60451C16.1296 3.84309 13.8913 1.60422 11.1299 1.60386C8.36846 1.60349 6.12959 3.84177 6.12922 6.6032C6.12886 9.36462 8.36714 11.6035 11.1286 11.6039Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={UserCoDeco}>
      <path d="M21.1994 22.9929C20.9473 22.695 20.8213 22.3572 20.8214 21.9795C20.8214 21.6018 20.9475 21.2865 21.1996 21.0335L23.7437 18.4901L13.8781 18.4888C13.4885 18.4888 13.1617 18.3567 12.8978 18.0927C12.6338 17.8287 12.5023 17.5023 12.5033 17.1136C12.5033 16.7241 12.6354 16.3973 12.8994 16.1333C13.1634 15.8693 13.4898 15.7379 13.8784 15.7388L23.7441 15.7401L21.2006 13.196C20.9257 12.921 20.7882 12.5942 20.7883 12.2156C20.7883 11.837 20.9259 11.5107 21.2009 11.2367C21.453 10.9617 21.7684 10.8242 22.147 10.8243C22.5255 10.8243 22.8404 10.9504 23.0915 11.2025L28.0409 16.1532C28.1784 16.2907 28.276 16.4397 28.3337 16.6001C28.3914 16.7605 28.4198 16.9324 28.4189 17.1157C28.4189 17.2991 28.3904 17.4709 28.3336 17.6313C28.2767 17.7918 28.1791 17.9407 28.0406 18.0782L23.09 23.0275C22.792 23.3254 22.4652 23.4574 22.1096 23.4234C21.7539 23.3894 21.4505 23.2459 21.1994 22.9929ZM7.00163 29.4879C6.24538 29.4878 5.59779 29.2182 5.05886 28.6792C4.51993 28.1401 4.25097 27.4929 4.25199 26.7376L4.25452 7.48755C4.25462 6.7313 4.52421 6.08371 5.06328 5.54478C5.60235 5.00585 6.24955 4.7369 7.00489 4.73791L15.2549 4.739C15.6445 4.73905 15.9712 4.87109 16.2352 5.13513C16.4992 5.39916 16.6307 5.72551 16.6297 6.11418C16.6297 6.50376 16.4976 6.83054 16.2336 7.0945C15.9695 7.35847 15.6432 7.48997 15.2545 7.489L7.00452 7.48791L7.00199 26.7379L15.252 26.739C15.6416 26.7391 15.9683 26.8711 16.2323 27.1351C16.4963 27.3992 16.6278 27.7255 16.6268 28.1142C16.6268 28.5038 16.4947 28.8305 16.2307 29.0945C15.9666 29.3585 15.6403 29.49 15.2516 29.489L7.00163 29.4879Z" fill="#D73324"/>
    </svg>
  </div>
    
  const DeconnecterNav = 
  <div>
    <button onClick={OpenPopupConnexion}>Connexion</button>
    <Connexion 
      onCancel={ClosePopupConnexion}          
      showConnexion={showConnexion} 
      changeConnexion={ChangeConnexionToInscription}
      changeMDPOublie={ChangeConnexionToMDPOublie}
      changeStatusUer={UserCoDeco}
    />
    <Inscription 
      onCancel={ClosePopupInscription}  
      showInscription={showInscription}
      changeInscription={ChangeInscriptionToConnexion}
      changeStatusUer={UserCoDeco}
    /> 
    <MDPOublie
      onCancel={ClosePopupMDPOublie}
      showMDPOublie={showMDPOublie}  
      changeConnexion={ChangeMDPOublieToConnexion}
      changeInscription={ChangeMDPOublieToInscription}
    />
  </div>
  

  return (
    <nav className="navbar">
      <div>
        <div>
          <a href="#"><Logo></Logo></a>
          <ul>
            <li><a href="#">Jouer</a></li>
            <li><a href="../../pages/Apprendre/Apprendre.tsx">Apprendre</a></li>
            <li><a href="#">Classement</a></li>
          </ul>
          <div>
            <svg width="28" height="19" viewBox="0 0 28 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M26.0522 7.63989H1.45159C0.649898 7.63989 0 8.28979 0 9.09148V9.24428C0 10.046 0.649898 10.6959 1.45159 10.6959H26.0522C26.8539 10.6959 27.5038 10.046 27.5038 9.24428V9.09148C27.5038 8.28979 26.8539 7.63989 26.0522 7.63989Z" fill="#F5F5F5"/>
              <path d="M26.0522 15.2798H1.45159C0.649898 15.2798 0 15.9297 0 16.7314V16.8842C0 17.6859 0.649898 18.3358 1.45159 18.3358H26.0522C26.8539 18.3358 27.5038 17.6859 27.5038 16.8842V16.7314C27.5038 15.9297 26.8539 15.2798 26.0522 15.2798Z" fill="#F5F5F5"/>
              <path d="M26.0522 0H1.45159C0.649898 0 0 0.649898 0 1.45159V1.60439C0 2.40608 0.649898 3.05597 1.45159 3.05597H26.0522C26.8539 3.05597 27.5038 2.40608 27.5038 1.60439V1.45159C27.5038 0.649898 26.8539 0 26.0522 0Z" fill="#F5F5F5"/>
            </svg>                        
          </div>
        </div>
        <div>
          { UserConnecter ? ConnecterNav : DeconnecterNav }
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
