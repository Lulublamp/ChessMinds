import React, { FC, useEffect, useState, useContext, useRef, useImperativeHandle, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginPopup from '../Form/LoginPopup';
import SignupPopup from '../Form/SignupPopup';
import { UserContext } from '../UserContext';
import { ClientEventManager, NAMESPACE_TYPES, PRIVATE_GAME } from '@TRPI/core/core-network';
import { API_BASE_URL } from '../../config';

interface AuthWrapperProps {
  showLoginPopup: boolean;
  showSignupPopup: boolean;
  isLogged: boolean;
  handleCloseLoginPopup: () => void;
  handleCloseSignupPopup: () => void;
  handleSwitchToSignup: () => void;
  handleSwitchToLogin: () => void;
}

const AuthWrapper = forwardRef((props: AuthWrapperProps, ref) =>{

  const navigate = useNavigate();
  const user = useContext(UserContext)
  const [publicManager, setPublicManager] = useState<ClientEventManager<PRIVATE_GAME> | null>(null);
  const publicManagerRef = useRef<ClientEventManager<PRIVATE_GAME> | null>(null);

  const handleSuccessfulLogin = () => {
    props.handleCloseLoginPopup();
    navigate('/MainMenu');
    const _clientManager = new ClientEventManager<PRIVATE_GAME>(import.meta.env.VITE_SERVER_URL || `${API_BASE_URL}`, NAMESPACE_TYPES.PRIVATE_GAME, localStorage.getItem("accessToken")!);
    setPublicManager(() => _clientManager);
    publicManagerRef.current = _clientManager;
  };
  
  useImperativeHandle(ref, () => ({
    handleSuccessfulLogin,
    getPublicManager: () => publicManagerRef.current,
  }));

  useEffect(() => {
    if (user.user !== null) {
      handleSuccessfulLogin();
    }
  }, [props.isLogged]);

  return (
    <>
      {props.showLoginPopup && (
        <LoginPopup
          onClose={props.handleCloseLoginPopup}
          onSwitch={props.handleSwitchToSignup}
          onSuccess={handleSuccessfulLogin}
        />
      )}
      {props.showSignupPopup && (
        <SignupPopup
          onClose={props.handleCloseSignupPopup}
          onSwitch={props.handleSwitchToLogin}
        />
      )}
    </>
  );
});
export default AuthWrapper;
