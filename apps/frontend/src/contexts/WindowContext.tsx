import { createContext , useContext } from 'react';
import ClientApi  from '@TRPI/client/electron/preload';

const WindowContext = createContext<ClientApi | null>(null);

const useWindowContext = () => useContext(WindowContext)

export { WindowContext, useWindowContext }