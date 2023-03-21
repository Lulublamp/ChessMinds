import React from 'react';
import InputForm from "../Form/InputForm";
import CancelButton from "../Button/CancelButton";
import './ConnexionIncrip.css';


interface ConnexionProps {
    onCancel: () => void;
    show : boolean;
}

const Connexion: React.FC<ConnexionProps> = ({ onCancel, show }) => {
    if (!show) {
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
                />
                <div>
                    <InputForm 
                        id="MDP" 
                        iconeInput={true}
                        placeHolder="Mot de passe"
                    />
                    <p>Mot de passe oublié ?</p>
                </div>
                <button className="PlayButton">Se connecter</button>
                <p>Pas de compte ? Incrivez-vous ici</p>
            </div>
            
            <CancelButton onCancel={onCancel}/>
        </div>
    </div>
    );
};
export default Connexion;








