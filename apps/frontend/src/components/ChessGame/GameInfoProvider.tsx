import { createContext, useContext, useState, ReactNode } from 'react';
import { MATCHMAKING_MODE, MATCHMAKING_MODES_TIMERS } from '@TRPI/core/core-network';


interface GameInfoContextType {
  selectedTimeMode: MATCHMAKING_MODES_TIMERS;
  isRanked: MATCHMAKING_MODE;
  setGameInfo: (selectedTimeMode: MATCHMAKING_MODES_TIMERS, isRanked: MATCHMAKING_MODE) => void;
}

const GameInfoContext = createContext<GameInfoContextType | undefined>(undefined);

export const useGameInfoContext = () => {
  const context = useContext(GameInfoContext);
  if (!context) {
    throw new Error('useGameInfoContext must be used within a GameInfoProvider');
  }
  return context;
};

interface GameInfoProviderProps {
  children: ReactNode;
}

export const GameInfoProvider: React.FC<GameInfoProviderProps> = ({ children }) => {
  const [selectedTimeMode, setSelectedTimeMode] = useState<MATCHMAKING_MODES_TIMERS>('bullet');
  const [isRanked, setIsRanked] = useState<MATCHMAKING_MODE>('unranked');

  const setGameInfo = (selectedTimeMode: MATCHMAKING_MODES_TIMERS, isRanked: MATCHMAKING_MODE) => {
    setSelectedTimeMode(selectedTimeMode);
    setIsRanked(isRanked);
  };

  return (
    <GameInfoContext.Provider value={{ selectedTimeMode, isRanked, setGameInfo }}>
      {children}
    </GameInfoContext.Provider>
  );
};
