import { useEffect, useState } from 'react';

// Devuelve el valor solo cuando deja de cambiar durante el tiempo indicado
export function useDebounce(valor, milisegundos = 300) {
  const [estable, setEstable] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => setEstable(valor), milisegundos);
    return () => clearTimeout(temporizador);
  }, [valor, milisegundos]);

  return estable;
}
