import React from 'react';
import SignupForm from '../components/SignupForm';
import logo from '../images/logo.png';
import './SignUpPageStyle.css';

function SignUpPage() {
  return (
    <section className="SignUp">
      <div>
        <img src={logo} alt="Logo" />
      </div>
      <div>
        <div>
          <button>Download Now
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.9393 27.0799C11.5251 27.6657 12.4749 27.6657 13.0607 27.0799L22.6066 17.5339C23.1924 16.9482 23.1924 15.9984 22.6066 15.4126C22.0208 14.8268 21.0711 14.8268 20.4853 15.4126L12 23.8979L3.51472 15.4126C2.92893 14.8268 1.97919 14.8268 1.3934 15.4126C0.807611 15.9984 0.807611 16.9482 1.3934 17.5339L10.9393 27.0799ZM10.5 0L10.5 26.0192H13.5L13.5 0L10.5 0Z"
                fill="white" />
            </svg>
          </button>
        </div>
        <h1><span>Hey,</span> S'inscrire maitenant</h1>
        <h2>et commencez à jouer aux échecs !</h2>
        <SignupForm />
      </div>
    </section>
  );
}

export default SignUpPage;