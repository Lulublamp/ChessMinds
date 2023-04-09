import React from 'react';
import './RejoindrePerso.css';
import CancelButton from "../Button/CancelButton";

interface RejoindrePersoProps {
  onCancel: () => void;
  onPlay: (RankedMode: string, TimerMode: string, Pseudo : string, Elo : number) => void;
}

const RejoindrePerso: React.FC<RejoindrePersoProps> = ({ onCancel, onPlay }) => {

    const [RankedMode, setRankedMode] = React.useState('Ranked');
    const [TimerMode, setTimerMode] = React.useState('bullet');
    const [Elo, setElo] = React.useState(100);
    const [Pseudo, setPseudo] = React.useState('pseudo');

// je sais pas si c utile pour la fonction qu'on va appeller sur le bouton rejoindre
    // const handleRankedModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setRankedMode(event.target.value);
    // };
  
    // const handleEloChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setElo(parseInt(event.target.value));
    // };

    // const handlePseudoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setPseudo(event.target.value);
    // };

    const [code, setCode] = React.useState('30');
    const handleCode = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCode(event.target.value);
    };

    return (
        <div className="RejoindrePartie">
            <div>
                <h2>Rejoindre une partie</h2>
                <div>
                    <label>Entrez le code secret de votre ami</label>
                    <input type="text" id="code" placeholder="Code secret" onChange={handleCode}></input>     
                </div>
                <button className="PlayButton" onClick={() => onPlay(RankedMode, TimerMode, Pseudo, Elo)}>Rejoindre</button>
                <CancelButton onCancel={onCancel}/>
            </div>
        </div>
    );
};

export default RejoindrePerso;