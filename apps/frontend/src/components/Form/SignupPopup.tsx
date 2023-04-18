import React, { useState } from 'react';
import './LoginSignInPopUpStyle.css';
import Logo from '../Logo/Logo';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

interface Props {
  onClose: () => void;
  onSwitch: () => void;
}

const SignupPopup: React.FC<Props> = ({ onClose, onSwitch }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirmVisibility = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if(password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if(password !== passwordConfirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    axios.post(`${API_BASE_URL}/joueurs/inscription`, {
      adresseMail: email,
      pseudo: username,
      motDePasse: password
    }).then(function (response) {
      console.log(response);
      onSwitch();
    }).catch(function (error) {
      console.log(error);
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
      }
    });
  };

  return (
    <section className="signup-PopUp">
      <div className="closePopup" onClick={onClose}></div>
      <div className="container">
        <div>
          <Logo width={65} height={65} />
          <h2>Inscrivez-vous pour jouer à Chess Minds</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15.8571 12C15.8571 14.1302 14.1302 15.8571 12 15.8571C9.86972 15.8571 8.14282 14.1302 8.14282 12C8.14282 9.86972 9.86972 8.14282 12 8.14282C14.1302 8.14282 15.8571 9.86972 15.8571 12ZM15.8571 12L15.8571 13.2857C15.8571 14.7059 17.0084 15.8571 18.4286 15.8571C19.3408 15.8571 20.1422 15.3821 20.5986 14.6658C20.8528 14.2671 21 13.7936 21 13.2857V12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C13.9122 21 15.6851 20.4037 17.1429 19.3868" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <label className="label-text" htmlFor="EmailSignup">
                  Adresse e-mail
                </label>
              </div>
              <input
                type="email"
                id="EmailSignup"
                name="EmailSignup"
                placeholder="Entrez votre adresse mail"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-container">
              <div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M17.5 21.0001H6.5C5.11929 21.0001 4 19.8808 4 18.5001C4 14.4194 10 14.5001 12 14.5001C14 14.5001 20 14.4194 20 18.5001C20 19.8808 18.8807 21.0001 17.5 21.0001Z" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <label className="label-text" htmlFor="Pseudo">
                  Pseudo
                </label>
              </div>
              <input
                type="text"
                id="Pseudo"
                name="Pseudo"
                placeholder="Entrez votre pseudo"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-container">
              <div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V10.4298M8 10.4298C5.77744 11.0952 5 12.6104 5 15.5C5 19.7059 6.64706 21 12 21C17.3529 21 19 19.7059 19 15.5C19 12.6104 18.2226 11.0952 16 10.4298C14.9876 10.1268 13.6753 10 12 10C10.3247 10 9.01243 10.1268 8 10.4298Z" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <label className="label-text" htmlFor="PasswordSignup">
                  Mot de passe
                </label>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="PasswordSignup"
                name="PasswordSignup"
                placeholder="Entrez votre mot de passe"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <svg className="toggle-password" width="19" height="18" viewBox="0 0 19 18" fill="none"
                onClick={togglePasswordVisibility}>
                <path
                  d="M0.201842 0.196973C0.0851662 0.311012 0.0142257 0.462198 0.00191996 0.623043C-0.0103858 0.783888 0.0367604 0.943709 0.134786 1.07345L0.201842 1.14888L3.90741 4.77242C2.10058 6.01046 0.810758 7.84371 0.274411 9.93607C0.233055 10.1083 0.262688 10.2895 0.356904 10.4406C0.45112 10.5917 0.602353 10.7004 0.777919 10.7434C0.953485 10.7863 1.13928 10.76 1.29516 10.6701C1.45104 10.5802 1.56447 10.4339 1.61095 10.2629C2.0876 8.40583 3.26155 6.79203 4.89948 5.74229L6.56211 7.36771C5.89797 8.04617 5.532 8.9519 5.5426 9.89092C5.55319 10.8299 5.9395 11.7276 6.61879 12.3915C7.29808 13.0555 8.21632 13.433 9.17683 13.4432C10.1373 13.4534 11.0637 13.0954 11.7576 12.4461L17.1947 17.7624C17.3176 17.8829 17.4827 17.9534 17.6566 17.9598C17.8306 17.9662 18.0006 17.908 18.1324 17.7968C18.2643 17.6857 18.3482 17.5299 18.3673 17.3607C18.3864 17.1916 18.3393 17.0216 18.2355 16.885L18.1684 16.8096L12.5531 11.319L12.554 11.3172L6.16988 5.07954L6.17171 5.07775L5.13096 4.06298L1.17554 0.196973C1.04636 0.070845 0.87126 0 0.688691 0C0.506122 0 0.331019 0.070845 0.201842 0.196973ZM9.18558 3.1425C8.267 3.1425 7.37598 3.27541 6.5318 3.52416L7.66808 4.63412C9.63344 4.25368 11.6732 4.62611 13.3656 5.67442C15.058 6.72273 16.2736 8.36674 16.7611 10.2665C16.8087 10.4362 16.9223 10.5809 17.0777 10.6698C17.233 10.7586 17.4177 10.7845 17.5923 10.7419C17.7669 10.6993 17.9175 10.5916 18.012 10.4419C18.1064 10.2921 18.1372 10.1122 18.0977 9.94056C17.5996 7.99854 16.4521 6.27487 14.8374 5.04324C13.2228 3.81161 11.2336 3.14262 9.18558 3.1425ZM9.36471 6.29457L12.8562 9.70707C12.8111 8.81614 12.4287 7.97344 11.7834 7.34277C11.1381 6.71209 10.276 6.33849 9.36471 6.29457Z"
                  fill="#121212" />
              </svg>
            </div>
            <div className="input-container">
              <div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V10.4298M8 10.4298C5.77744 11.0952 5 12.6104 5 15.5C5 19.7059 6.64706 21 12 21C17.3529 21 19 19.7059 19 15.5C19 12.6104 18.2226 11.0952 16 10.4298C14.9876 10.1268 13.6753 10 12 10C10.3247 10 9.01243 10.1268 8 10.4298Z" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <label className="label-text" htmlFor="PasswordConfirm">
                  Confirmation du mot de passe
                </label>
              </div>
              <input
                type={showPasswordConfirm ? "text" : "password"}
                id="PasswordConfirm"
                name="PasswordConfirm"
                placeholder="Confirmez votre mot de passe"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              <svg className="toggle-password" width="19" height="18" viewBox="0 0 19 18" fill="none"
                onClick={togglePasswordConfirmVisibility}>
                <path
                  d="M0.201842 0.196973C0.0851662 0.311012 0.0142257 0.462198 0.00191996 0.623043C-0.0103858 0.783888 0.0367604 0.943709 0.134786 1.07345L0.201842 1.14888L3.90741 4.77242C2.10058 6.01046 0.810758 7.84371 0.274411 9.93607C0.233055 10.1083 0.262688 10.2895 0.356904 10.4406C0.45112 10.5917 0.602353 10.7004 0.777919 10.7434C0.953485 10.7863 1.13928 10.76 1.29516 10.6701C1.45104 10.5802 1.56447 10.4339 1.61095 10.2629C2.0876 8.40583 3.26155 6.79203 4.89948 5.74229L6.56211 7.36771C5.89797 8.04617 5.532 8.9519 5.5426 9.89092C5.55319 10.8299 5.9395 11.7276 6.61879 12.3915C7.29808 13.0555 8.21632 13.433 9.17683 13.4432C10.1373 13.4534 11.0637 13.0954 11.7576 12.4461L17.1947 17.7624C17.3176 17.8829 17.4827 17.9534 17.6566 17.9598C17.8306 17.9662 18.0006 17.908 18.1324 17.7968C18.2643 17.6857 18.3482 17.5299 18.3673 17.3607C18.3864 17.1916 18.3393 17.0216 18.2355 16.885L18.1684 16.8096L12.5531 11.319L12.554 11.3172L6.16988 5.07954L6.17171 5.07775L5.13096 4.06298L1.17554 0.196973C1.04636 0.070845 0.87126 0 0.688691 0C0.506122 0 0.331019 0.070845 0.201842 0.196973ZM9.18558 3.1425C8.267 3.1425 7.37598 3.27541 6.5318 3.52416L7.66808 4.63412C9.63344 4.25368 11.6732 4.62611 13.3656 5.67442C15.058 6.72273 16.2736 8.36674 16.7611 10.2665C16.8087 10.4362 16.9223 10.5809 17.0777 10.6698C17.233 10.7586 17.4177 10.7845 17.5923 10.7419C17.7669 10.6993 17.9175 10.5916 18.012 10.4419C18.1064 10.2921 18.1372 10.1122 18.0977 9.94056C17.5996 7.99854 16.4521 6.27487 14.8374 5.04324C13.2228 3.81161 11.2336 3.14262 9.18558 3.1425ZM9.36471 6.29457L12.8562 9.70707C12.8111 8.81614 12.4287 7.97344 11.7834 7.34277C11.1381 6.71209 10.276 6.33849 9.36471 6.29457Z"
                  fill="#121212" />
              </svg>
            </div>
            <button type="submit">S'inscrire</button>
            <span className="statut">{error}</span>
          </form>
          <span className="switchLogSign">
            Vous avez déjà un compte ?{' '}
            <button className="play-btn" onClick={onSwitch}>
              Se connecter
            </button>
          </span>
        </div>
        <svg onClick={onClose} className="closePopup" width="25" height="25" viewBox="0 0 25 25" fill="none">
          <path
            d="M25 2.63625L22.3638 0L12.5 9.86375L2.63625 0L0 2.63625L9.86375 12.5L0 22.3638L2.63625 25L12.5 15.1362L22.3638 25L25 22.3638L15.1362 12.5L25 2.63625Z"
            fill="#212121" />
        </svg>
      </div>
    </section>
  );
};

export default SignupPopup;
