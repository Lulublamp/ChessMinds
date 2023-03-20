import React from 'react';
import InputForm from "../Form/InputForm";
import CancelButton from "../Button/CancelButton";
import './ConnexionIncrip.css';


interface InscriptionProps {
    onCancel: () => void;
}

const Inscription: React.FC<InscriptionProps> = ({ onCancel }) => {

    return (
    <div className="ConnexionIncrip">
        <div className="ConnexionIncrip-container">
            <h2>Inscrit toi dès maintenant pour jouer à Chess Minds</h2>
            <div className="Form-ConnexionIncrip" >
                <InputForm 
                    id="e-mail" 
                    iconeInput={false}
                    valueInput="Adresse e-mail"
                />
                <InputForm 
                    id="pseudo" 
                    iconeInput={false}
                    valueInput="Pseudo"
                />
                <InputForm 
                    id="MDP" 
                    iconeInput={true}
                    valueInput="Mot de passe"
                />
                <InputForm 
                    id="ConfirmMDP" 
                    iconeInput={false}
                    valueInput="Confirmation du mot de passe"
                />
                <button className="PlayButton">Se connecter</button>
                <p>Vous avez déjà un compte ? Se connecter</p>
            </div>
            
            <CancelButton onCancel={onCancel}/>
        </div>
    </div>
    );
};

export default Inscription;








