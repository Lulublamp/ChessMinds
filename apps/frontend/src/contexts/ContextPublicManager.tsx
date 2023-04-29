import { CONNECTION, ClientEventManager, PRIVATE_GAME } from '@TRPI/core/core-network';
import { createContext, useContext } from 'react';

export interface PublicContextData {
  publicManager: ClientEventManager<CONNECTION> | null;
}

export const PublicContext = createContext<PublicContextData | undefined>(
  undefined
);

const usePublicContext = () => {
  const context = useContext(PublicContext);
  if (!context) {
    throw new Error(
      'usePublicContext must be used within a PublicContextProvider'
    );
  }
  return context;
}

export const useGlobalSocket = () => {
  const { publicManager } = usePublicContext();
  return publicManager;
}