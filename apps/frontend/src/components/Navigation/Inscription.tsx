import React from 'react';
import InputForm from "../Form/InputForm";
import CancelButton from "../Button/CancelButton";
import './ConnexionIncrip.css';
import axios from 'axios';

interface InscriptionProps {
    onCancel: () => void;
    showInscription : boolean;
    changeInscription: () => void;
    changeStatusUer: () => void;
}

const Inscription: React.FC<InscriptionProps> = ({ onCancel, showInscription, changeInscription, changeStatusUer}) => {
    const [ErreurInscription, setErreurInscription] = React.useState(false);
    const ShowErreur = () => {
        setErreurInscription(true);
    };    
    

    //verifier Inscription
    const [mail, setMail]= React.useState('mail');
    const handleMail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMail(event.target.value);
    };

    const [pseudo, setPseudo]= React.useState('pseudo');
    const handlePseudo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPseudo(event.target.value);
    };

    const [mdp, setMdp]= React.useState('mdp');
    const handleMdp = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMdp(event.target.value);
    };

    const [confirmMdp, setConfirmMdp]= React.useState('confirmMdp');
    const handleConfirmMdp = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmMdp(event.target.value);
    };

    function checkInscription(){
        //a check les url
        axios.post(' http://localhost:5173/inscription',{
            params: {
                mail: mail,
                pseudo: pseudo,
                mdp: mdp,
                confirmMdp: confirmMdp
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


    if (!showInscription) {
        return null;
    }
    return (
    <div className="ConnexionIncrip">
        <div className="ConnexionIncrip-container">
            <h2>Inscrit toi dès maintenant pour jouer à Chess Minds</h2>
            <div className="Form-ConnexionIncrip" >
                <div>
                    <div className={ErreurInscription ? "ErreurValeur" : ""}>
                        <InputForm 
                            id="e-mail" 
                            iconeInput={false}
                            placeHolder="Adresse e-mail"
                            type='text'
                            onChange={handleMail}
                        />
                    </div>
                    
                    <InputForm 
                        id="pseudo" 
                        iconeInput={false}
                        placeHolder="Pseudo"
                        type='text'
                        onChange={handlePseudo}
                    />
                    <InputForm 
                        id="MDP" 
                        iconeInput={true}
                        placeHolder="Mot de passe"
                        type='password'
                        onChange={handleMdp}
                    />
                    <InputForm 
                        id="ConfirmMDP" 
                        iconeInput={false}
                        placeHolder="Confirmation du mot de passe"
                        type='password'
                        onChange={handleConfirmMdp}
                    />
                </div>
                <p className={ErreurInscription ? "Erreur" : "ErreurHide"}>L'adresse mail est dèja utilisé ! Veuillez réessayer</p>
                <button className="PlayButton" onClick={checkInscription}>S'inscrire</button>
                <p className="link" onClick={changeInscription}>Vous avez déjà un compte ? Se connecter</p>
            </div>
            
            <CancelButton onCancel={onCancel}/>
        </div>
    </div>
    );
};

export default Inscription;
