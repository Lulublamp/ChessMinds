/* eslint-disable react/display-name */
import React, { FC, useEffect, useState, useContext, useRef, useImperativeHandle, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginPopup from '../Form/LoginPopup';
import SignupPopup from '../Form/SignupPopup';
import { UserContext } from '../UserContext';

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

  const handleSuccessfulLogin = () => {
    props.handleCloseLoginPopup();
    navigate('/MainMenu');
  };
  
  const handleGoToMainMenu = () => {
    navigate('/MainMenu');
  };

  useImperativeHandle(ref, () => ({
    handleSuccessfulLogin,
    handleGoToMainMenu
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
