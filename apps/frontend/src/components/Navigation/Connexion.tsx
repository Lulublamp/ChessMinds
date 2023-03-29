import React from 'react';
import InputForm from "../Form/InputForm";
import CancelButton from "../Button/CancelButton";
import './ConnexionIncrip.css';
import axios from 'axios';

interface ConnexionProps {
    onCancel: () => void;
    showConnexion : boolean;
    changeConnexion: () => void;
    changeMDPOublie: () => void;
    changeStatusUer: () => void;
}


const Connexion: React.FC<ConnexionProps> = ({ onCancel, showConnexion, changeConnexion, changeMDPOublie, changeStatusUer}) => {
    const [ErreurConnexion, setErreurConnexion] = React.useState(false);
    const ShowErreur = () => {
        setErreurConnexion(true);
    };


    //verfier connexion
    const [mail, setMail] = React.useState('mail');
    const handleMail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMail(event.target.value);
    };
    
    const [mdp, setMdp] = React.useState('mdp');
    const handleMdp = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMdp(event.target.value);
    };

    function checkConnexion(){
        axios.post('http://localhost:5173/cherche/:email',{
            params: {
                mail: mail,
                mdp: mdp
            }
        })
        .then(function (response) {
            console.log(response);
            if(response.data == "ok"){
                changeStatusUer();
            }else{
                ShowErreur();
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    
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
                            onChange={handleMail}
                        />
                    </div>
                    <div id='MdpDiv'>
                        <InputForm 
                            id="MDP" 
                            iconeInput={true}
                            placeHolder="Mot de passe"
                            type='password'
                            onChange={handleMdp}
                        />
                        <p className="link" onClick={changeMDPOublie}>Mot de passe oublié ?</p>
                    </div>
                </div>
                <span className={ErreurConnexion ? "Erreur" : "ErreurHide"}>L'adresse mail ou le mot de passe est faux ! Veuillez réessayer</span>
                <button className="PlayButton" onClick={checkConnexion}>Se connecter</button>
                <p className="link" onClick={changeConnexion}>Pas de compte ? Incrivez-vous ici</p>
            </div>
            
            <CancelButton onCancel={onCancel}/>
        </div>
    </div>
    );
};
export default Connexion;
