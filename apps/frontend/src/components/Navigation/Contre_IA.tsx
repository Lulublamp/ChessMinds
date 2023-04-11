import React from 'react';
import CancelButton from "../Button/CancelButton";
import ElementSelonNiveauIA from './ElementSelonNivIA';
import './Contre_IA.css';

interface IAProps {
    id: string;
    JouerVsIA?: () => void;
    onCancel: () => void;
}

const IAPopUP: React.FC<IAProps> = ({id, JouerVsIA, onCancel}) => {
    const [NumberNiv, setNumberIA] = React.useState(1);

    const RightNiv = () => {
        setNumberIA((NumberNiv + 1)%5);
    };

    const LeftNiv = () => {
        setNumberIA((NumberNiv - 1)%5);
    };

    return (
    <div className="Match_contre_IA" id={id}>
        <div>
            <h2>Match contre l'IA</h2>
            <div>
                <ElementSelonNiveauIA levelIA={NumberNiv} />
                <div>
                    <div>
                        <svg width="53" height="54" viewBox="0 0 53 54" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={LeftNiv}>
                            <path d="M25.0014 34.4008C25.4061 34.8055 25.9124 34.9983 26.5202 34.9792C27.1266 34.9615 27.6321 34.7503 28.0369 34.3456C28.4416 33.9409 28.644 33.4258 28.644 32.8003C28.644 32.1748 28.4416 31.6596 28.0369 31.2549L26.05 29.268H33.1697C33.7952 29.268 34.3103 29.0561 34.715 28.6322C35.1197 28.2098 35.3221 27.6859 35.3221 27.0604C35.3221 26.4349 35.1109 25.9102 34.6885 25.4863C34.2647 25.0639 33.74 24.8527 33.1145 24.8527H26.05L28.0921 22.8106C28.4968 22.4059 28.6903 21.8996 28.6727 21.2918C28.6535 20.6854 28.4416 20.1799 28.0369 19.7751C27.6321 19.3704 27.117 19.168 26.4915 19.168C25.866 19.168 25.3509 19.3704 24.9462 19.7751L19.2063 25.515C18.8015 25.9198 18.5992 26.4349 18.5992 27.0604C18.5992 27.6859 18.8015 28.201 19.2063 28.6057L25.0014 34.4008ZM26.4915 49.1369C23.4376 49.1369 20.5677 48.557 17.8817 47.3972C15.1957 46.2389 12.8593 44.6664 10.8724 42.6795C8.88553 40.6926 7.31295 38.3562 6.15467 35.6702C4.99491 32.9842 4.41504 30.1143 4.41504 27.0604C4.41504 24.0065 4.99491 21.1365 6.15467 18.4505C7.31295 15.7646 8.88553 13.4281 10.8724 11.4413C12.8593 9.45437 15.1957 7.88106 17.8817 6.72131C20.5677 5.56303 23.4376 4.98389 26.4915 4.98389C29.5454 4.98389 32.4154 5.56303 35.1013 6.72131C37.7873 7.88106 40.1238 9.45437 42.1106 11.4413C44.0975 13.4281 45.6701 15.7646 46.8284 18.4505C47.9881 21.1365 48.568 24.0065 48.568 27.0604C48.568 30.1143 47.9881 32.9842 46.8284 35.6702C45.6701 38.3562 44.0975 40.6926 42.1106 42.6795C40.1238 44.6664 37.7873 46.2389 35.1013 47.3972C32.4154 48.557 29.5454 49.1369 26.4915 49.1369Z" fill="black"/>
                        </svg>
                    </div>
                    <div>
                        <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={RightNiv}>
                            <path d="M27.4749 35.891L36.3055 27.0604L27.4749 18.2298L24.3842 21.3205L27.9164 24.8527H18.6443V29.268H27.9164L24.3842 32.8003L27.4749 35.891ZM27.4749 49.1369C24.421 49.1369 21.5511 48.557 18.8651 47.3972C16.1791 46.2389 13.8427 44.6664 11.8558 42.6795C9.86893 40.6926 8.29634 38.3562 7.13806 35.6702C5.97831 32.9842 5.39844 30.1143 5.39844 27.0604C5.39844 24.0065 5.97831 21.1365 7.13806 18.4505C8.29634 15.7646 9.86893 13.4281 11.8558 11.4413C13.8427 9.45437 16.1791 7.88106 18.8651 6.72131C21.5511 5.56303 24.421 4.98389 27.4749 4.98389C30.5288 4.98389 33.3988 5.56303 36.0847 6.72131C38.7707 7.88106 41.1072 9.45437 43.094 11.4413C45.0809 13.4281 46.6535 15.7646 47.8118 18.4505C48.9715 21.1365 49.5514 24.0065 49.5514 27.0604C49.5514 30.1143 48.9715 32.9842 47.8118 35.6702C46.6535 38.3562 45.0809 40.6926 43.094 42.6795C41.1072 44.6664 38.7707 46.2389 36.0847 47.3972C33.3988 48.557 30.5288 49.1369 27.4749 49.1369Z" fill="black"/>
                        </svg>
                    </div>
                </div>
            </div>
            <button className="PlayButton" onClick={JouerVsIA}>Jouer</button>     
            <CancelButton onCancel={onCancel}/>
        </div>
    </div>
    );
};

export default IAPopUP;
