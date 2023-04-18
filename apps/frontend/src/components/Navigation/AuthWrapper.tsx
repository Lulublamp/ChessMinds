import React, { FC, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginPopup from '../Form/LoginPopup';
import SignupPopup from '../Form/SignupPopup';
import { UserContext } from '../UserContext';

interface AuthWrapperProps {
  showLoginPopup: boolean;
  showSignupPopup: boolean;
  handleCloseLoginPopup: () => void;
  handleCloseSignupPopup: () => void;
  handleSwitchToSignup: () => void;
  handleSwitchToLogin: () => void;
}

const AuthWrapper: FC<AuthWrapperProps> = ({
  showLoginPopup,
  showSignupPopup,
  handleCloseLoginPopup,
  handleCloseSignupPopup,
  handleSwitchToSignup,
  handleSwitchToLogin,
}) => {

  const navigate = useNavigate();
  const user = useContext(UserContext)

  const handleSuccessfulLogin = () => {
    handleCloseLoginPopup();
    navigate('/MainMenu');
  };

  useEffect(() => {
    if (user.user !== null) {
      handleSuccessfulLogin();
    }
  }, [user]);

  return (
    <>
      {showLoginPopup && (
        <LoginPopup
          onClose={handleCloseLoginPopup}
          onSwitch={handleSwitchToSignup}
          onSuccess={handleSuccessfulLogin}
        />
      )}
      {showSignupPopup && (
        <SignupPopup
          onClose={handleCloseSignupPopup}
          onSwitch={handleSwitchToLogin}
        />
      )}
    </>
  );
};

export default AuthWrapper;
