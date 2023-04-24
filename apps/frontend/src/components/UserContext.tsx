import { createContext } from 'react';

export interface User {
  id: string;
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
