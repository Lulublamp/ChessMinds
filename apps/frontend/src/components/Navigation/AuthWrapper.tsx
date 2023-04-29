/* eslint-disable react/display-name */
import React, { FC, useEffect, useState, useContext, useRef, useImperativeHandle, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginPopup from '../Form/LoginPopup';
import SignupPopup from '../Form/SignupPopup';
import { UserContext } from '../UserContext';
import { CONNECTION, ClientEventManager, NAMESPACE_TYPES } from '@TRPI/core/core-network';
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
  // const [publicManager, setPublicManager] = useState<ClientEventManager<CONNECTION> | null>(null);
  // const publicManagerRef = useRef<ClientEventManager<CONNECTION> | null>(null);
  const isConnected = user.user !== null;

  const handleSuccessfulLogin = () => {
    props.handleCloseLoginPopup();
    navigate('/MainMenu');
    // console.log('Attempting to connect to the server...');
    // setPublicManager(() => _clientManager);
    // publicManagerRef.current = _clientManager;
  };
  
  useImperativeHandle(ref, () => ({
    handleSuccessfulLogin,
    // getPublicManager: () => publicManagerRef.current,
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
