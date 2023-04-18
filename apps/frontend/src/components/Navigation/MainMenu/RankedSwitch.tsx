import React, { useState } from 'react';
import { MATCHMAKING_MODE } from '@TRPI/core/core-network';

interface RankedSwitchProps {
  onRankedChange: (checked: MATCHMAKING_MODE) => void;
}

const RankedSwitch: React.FC<RankedSwitchProps> = ({ onRankedChange }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setChecked(isChecked);
    if(isChecked)
      onRankedChange('ranked');
    else 
      onRankedChange('unranked');
  };

  return (
    <div className="rankedFormat">
      <span>Évaluée</span>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={handleChange}/>
        <span className="slider">
          <span className="icon-wrapper">
            <span className="unchecked-icon">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M8.99999 1L1 9M1.00001 1L9 9" stroke="#001A72" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round" />
              </svg>
            </span>
            <span className="checked-icon">
              <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                <path d="M11 1L3.99998 8.00002L0.999939 5" stroke="#001A72" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
        </span>
      </label>
    </div>
  );
};

export default RankedSwitch;
