import React from 'react';
import InputForm from "../Form/InputForm";
import CancelButton from "../Button/CancelButton";
import './ConnexionIncrip.css';


interface ConnexionProps {
    onCancel: () => void;
    showConnexion : boolean;
    changeConnexion: () => void;
    changeMDPOublie: () => void;
}


const Connexion: React.FC<ConnexionProps> = ({ onCancel, showConnexion, changeConnexion, changeMDPOublie }) => {
    if (!showConnexion) {
        return null;
    }
    return (
    <div className="ConnexionIncrip">
        <div className="ConnexionIncrip-container">
            <h2>Connecte toi pour jouer à Chess Minds</h2>
            <div className="Form-ConnexionIncrip" >
                <InputForm 
                    id="e-mail" 
                    iconeInput={false}
                    placeHolder="Adresse mail"
                    type='text'
                />
                <div>
                    <InputForm 
                        id="MDP" 
                        iconeInput={true}
                        placeHolder="Mot de passe"
                        type='password'
                    />
                    <p onClick={changeMDPOublie}>Mot de passe oublié ?</p>
                </div>
                <button className="PlayButton">Se connecter</button>
                <p onClick={changeConnexion}>Pas de compte ? Incrivez-vous ici</p>
            </div>
            
            <CancelButton onCancel={onCancel}/>
        </div>
    </div>
    );
};
export default Connexion;
