import React from 'react';
import InputForm from "../Form/InputForm";
import CancelButton from "../Button/CancelButton";
import './ConnexionIncrip.css';


interface ConnexionProps {
    onCancel: () => void;
    onConnexion: (motdepasse: string, email: string) => void;
}

const Connexion: React.FC<ConnexionProps> = ({ onCancel, onConnexion }) => {
    const [motdepasse, setMDP] = React.useState('motdepasse');
    const [email, setEmail] = React.useState('email');
    
    const handleMDPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMDP(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    return (
    <div className="ConnexionIncrip">
        <div className="ConnexionIncrip-container">
            <h2>Connecte toi pour jouer à Chess Minds</h2>
            <div className="Form-ConnexionIncrip" >
                <InputForm 
                    id="e-mail" 
                    iconeInput={false}
                    valueInput="Adresse e-mail"
                    onChangeInput={handleEmailChange}
                />
                <InputForm 
                    id="MDP" 
                    iconeInput={true}
                    valueInput="Mot de passe"
                    onChangeInput={handleMDPChange}
                />
                <p>Mot de passe oublié ?</p>
                <button className="PlayButton" onClick={() => onConnexion(motdepasse, email)}>Se connecter</button>
                <p>Pas de compte ? Incrivez-vous ici</p>
            </div>
            
            <CancelButton onCancel={onCancel}/>
        </div>
    </div>
    );
};

export default Connexion;








