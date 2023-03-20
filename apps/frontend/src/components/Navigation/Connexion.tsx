import React from 'react';
import InputForm from "../Form/InputForm";
import CancelButton from "../Button/CancelButton";
import './ConnexionIncrip.css';


interface ConnexionProps {
    onCancel: () => void;
}

const Connexion: React.FC<ConnexionProps> = ({ onCancel }) => {
    return (
    <div className="ConnexionIncrip">
        <div className="ConnexionIncrip-container">
            <h2>Connecte toi pour jouer à Chess Minds</h2>
            <div className="Form-ConnexionIncrip" >
                <InputForm 
                    id="e-mail" 
                    iconeInput={false}
                    valueInput="Adresse e-mail"
                />
                <div>
                    <InputForm 
                        id="MDP" 
                        iconeInput={true}
                        valueInput="Mot de passe"
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








