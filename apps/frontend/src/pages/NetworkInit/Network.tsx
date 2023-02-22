import * as React from "react";
import {  FC, useState } from "react";
import './Network.css'


const Login: FC = () => {
  const [login, setLogin] = useState<string>('');
  const [mdp, setMdp] = useState<string>('');
  

  function changeLogin(event: React.ChangeEvent<HTMLInputElement>) {
    setLogin(() => event.target.value);
  }

  function changeMdp(event: React.ChangeEvent<HTMLInputElement>) {
    setMdp(() => event.target.value);
  }

  return (
    <div id="Login">
      <form >
        <label htmlFor="login">Login</label>
        <input type="text" name="login" onChange={(event) => changeLogin(event)}/>
      </form>
      <form >
        <label htmlFor="mdp">Mot de passe</label>
        <input type="text" name="mdp" onChange={(event) => changeMdp(event)}/>
      </form>
      <button>
        Connexion
      </button>
    </div>
  )
};

const Game: FC = () => {
  return (
    <div id="Game">
      <h1>Game</h1>
    </div>
  )
};


const Network: FC = () => {
  const [login, setLogin] = useState<boolean>(true);
  const [onGame, setOnGame] = useState<boolean>(false);



  return (
    <>
    {
      login && <Login />
    }
    </>
  )
};

export default Network;
