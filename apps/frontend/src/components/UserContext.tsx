import { createContext } from 'react';

export interface User {
  pseudo: string;
  email: string;
}

export const UserContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
}>({
  user: null,
  setUser: () => {},
});
