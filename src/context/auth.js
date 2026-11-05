import { createContext, useContext } from 'react';

export const AuthContexto = createContext(null);

export const useAuth = () => useContext(AuthContexto);
