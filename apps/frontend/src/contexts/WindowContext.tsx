import { createContext } from 'react';
import ClientApi  from '@TRPI/client/electron/preload';

export const WindowContext = createContext<ClientApi | null>(null);