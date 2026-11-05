import { useState } from 'react';
import { leerError } from '../utils/errores.js';
import { useToast } from './useToast.js';

// Flujo pedir -> confirmar -> avisar. La respuesta de la API da el mensaje del aviso:
// asi un soft delete explica que el producto quedo inactivo en vez de decir "eliminado".
export function useConfirmacion({ accion, alCompletar, mensajeExito }) {
  const toast = useToast();
  const [objetivo, setObjetivo] = useState(null);
  const [procesando, setProcesando] = useState(false);

  const confirmar = async () => {
    setProcesando(true);
    try {
      const { data } = await accion(objetivo);
      toast.exito(data?.mensaje ?? mensajeExito);
      alCompletar();
    } catch (error) {
      toast.error(leerError(error).mensaje);
    }
    setProcesando(false);
    setObjetivo(null);
  };

  return { objetivo, procesando, pedir: setObjetivo, cancelar: () => setObjetivo(null), confirmar };
}
