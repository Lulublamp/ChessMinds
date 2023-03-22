import React from 'react';
import InputForm from "../Form/InputForm";
import CancelButton from "../Button/CancelButton";
import './ConnexionIncrip.css';


interface ConnexionProps {
    onCancel: () => void;
    showMDPOublie : boolean;
    changeConnexion: () => void;
    changeInscription: () => void;
}


const Connexion: React.FC<ConnexionProps> = ({ onCancel, showMDPOublie, changeConnexion, changeInscription }) => {
    if (!showMDPOublie) {
        return null;
    }
    return (
    <div className="ConnexionIncrip">
        <div className="ConnexionIncrip-container">
            <h2>Vous avez oublié votre mot de passe ?</h2>
            <div className="Form-ConnexionIncrip" >
                <InputForm 
                    id="e-mail" 
                    iconeInput={false}
                    placeHolder="Saisir un e-mail"
                    type='text'
                />
                <button className="PlayButton">Valider</button>
                <p onClick={changeConnexion}>Vous avez déjà un compte ? Se connecter</p>
                <p onClick={changeInscription}>Pas de compte ? Incrivez-vous ici</p>
            </div>
            
            <CancelButton onCancel={onCancel}/>
        </div>
    </div>
    );
};
export default Connexion;
