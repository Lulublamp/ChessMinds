import React from 'react';
import InputForm from "../Form/InputForm";
import CancelButton from "../Button/CancelButton";
import './ConnexionIncrip.css';


interface InscriptionProps {
    onCancel: () => void;
    showInscription : boolean;
    changeInscription: () => void;
}


const Inscription: React.FC<InscriptionProps> = ({ onCancel, showInscription, changeInscription}) => {
    if (!showInscription) {
        return null;
    }
    return (
    <div className="ConnexionIncrip">
        <div className="ConnexionIncrip-container">
            <h2>Inscrit toi dès maintenant pour jouer à Chess Minds</h2>
            <div className="Form-ConnexionIncrip" >
                <InputForm 
                    id="e-mail" 
                    iconeInput={false}
                    placeHolder="Adresse e-mail"
                    type='text'
                />
                <InputForm 
                    id="pseudo" 
                    iconeInput={false}
                    placeHolder="Pseudo"
                    type='text'
                />
                <InputForm 
                    id="MDP" 
                    iconeInput={true}
                    placeHolder="Mot de passe"
                    type='password'
                />
                <InputForm 
                    id="ConfirmMDP" 
                    iconeInput={false}
                    placeHolder="Confirmation du mot de passe"
                    type='password'
                />
                <button className="PlayButton">Se connecter</button>
                <p onClick={changeInscription}>Vous avez déjà un compte ? Se connecter</p>
            </div>
            
            <CancelButton onCancel={onCancel}/>
        </div>
    </div>
    );
};

export default Inscription;








