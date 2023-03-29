import React from 'react';
import InputForm from "../Form/InputForm";
import CancelButton from "../Button/CancelButton";
import './ConnexionIncrip.css';
import axios from 'axios';

interface ConnexionProps {
    onCancel: () => void;
    showMDPOublie : boolean;
    changeConnexion: () => void;
    changeInscription: () => void;
}


const Connexion: React.FC<ConnexionProps> = ({ onCancel, showMDPOublie, changeConnexion, changeInscription }) => {
    const [ErreurMDPOublie, setErreurMDPOublie] = React.useState(false);
    const ShowErreur = () => {
        setErreurMDPOublie(true);
    };
    const HideErreur = () => {
        setErreurMDPOublie(false);
    };

    const [MDPEnvoyer, setEnvoie] = React.useState(false);
    const ShowMessEnvoyer = () => {
        setEnvoie(true);
    };
    const HideMessEnvoyer = () => {
        setEnvoie(false);
    };
    

    const[mail, setMail] = React.useState('mail');
    const handleMail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMail(event.target.value);
    };

    function checkMDPOublie(){
        axios.get('http://localhost:5173/cherche/:email',{
            params: {
                mail: mail
            }
        })
        .then(function (response) {
            console.log(response);
            if(response.data == "ok"){
                ShowMessEnvoyer();
                HideErreur();
            }else{
                ShowErreur();
                HideMessEnvoyer();
            }   
        })
        .catch(function (error) {
            console.log(error);
        });
    };


    if (!showMDPOublie) {
        return null;
    }
    return (
    <div className="ConnexionIncrip">
        <div className="ConnexionIncrip-container">
            <h2>Vous avez oublié votre mot de passe ?</h2>
            <div className="Form-ConnexionIncrip" >
                <div className={ErreurMDPOublie ? "ErreurValeur" : ""}>
                    <InputForm 
                        id="e-mail" 
                        iconeInput={false}
                        placeHolder="Saisir un e-mail"
                        type='text'
                        onChange={handleMail}
                    />
                </div>
                <p className={MDPEnvoyer ? "MDPEnvoie" : "Hide"}>Votre nouveau mot de passe vous a été envoyé dans votre boîte mail</p>
                <p className={ErreurMDPOublie ? "Erreur" : "Hide"}>L'adresse mail est associée à aucun compte ! Veuillez réessayer</p>
                <button className="PlayButton" onClick={checkMDPOublie}>Valider</button>
                <p className="link" onClick={changeConnexion}>Vous avez déjà un compte ? Se connecter</p>
                <p className="link" onClick={changeInscription}>Pas de compte ? Incrivez-vous ici</p>
            </div>
            
            <CancelButton onCancel={onCancel}/>
        </div>
    </div>
    );
};
export default Connexion;
