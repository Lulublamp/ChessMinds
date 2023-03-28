import React from 'react';
import InputForm from "../Form/InputForm";
import CancelButton from "../Button/CancelButton";
import './ConnexionIncrip.css';


interface ConnexionProps {
    onCancel: () => void;
    showConnexion : boolean;
    changeConnexion: () => void;
    changeMDPOublie: () => void;
    changeStatusUer: () => void;
}


const Connexion: React.FC<ConnexionProps> = ({ onCancel, showConnexion, changeConnexion, changeMDPOublie, changeStatusUer }) => {
     
    const [ErreurConnexion, setErreurConnexion] = React.useState(false);

    const ShowErreur = () => {
        setErreurConnexion(true);
    };
    
    const HideErreur = () => {
        setErreurConnexion(false);
    };
    
    if (!showConnexion) {
        return null;
    }

    return (
    <div className="ConnexionIncrip">
        <div className="ConnexionIncrip-container">
            <h2>Connecte toi pour jouer à Chess Minds</h2>
            <div className="Form-ConnexionIncrip" >
                <div className={ErreurConnexion ? "ErreurValeur" : ""}>
                    <div>
                        <InputForm 
                            id="e-mail" 
                            iconeInput={false}
                            placeHolder="Adresse mail"
                            type='text'
                        />
                    </div>
                    <div id='MdpDiv'>
                        <InputForm 
                            id="MDP" 
                            iconeInput={true}
                            placeHolder="Mot de passe"
                            type='password'
                        />
                        <p className="link" onClick={changeMDPOublie}>Mot de passe oublié ?</p>
                    </div>
                </div>
                <span className={ErreurConnexion ? "Erreur" : "ErreurHide"}>L'adresse mail ou le mot de passe est faux ! Veuillez réessayer</span>
                <button className="PlayButton">Se connecter</button>
                <p className="link" onClick={changeConnexion}>Pas de compte ? Incrivez-vous ici</p>
            </div>
            
            <CancelButton onCancel={onCancel}/>
        </div>
    </div>
    );
};
export default Connexion;
