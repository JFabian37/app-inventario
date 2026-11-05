import { createContext, useContext } from 'react';

export const ToastContexto = createContext(null);

// Uso: const toast = useToast(); toast.exito('Guardado'); toast.error('Fallo');
export const useToast = () => useContext(ToastContexto);
