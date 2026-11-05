import { useCallback, useEffect, useState } from 'react';
import api from '../services/api.js';
import { leerError } from '../utils/errores.js';

// GET con cancelacion de respuestas viejas. El estado de carga se deduce comparando la
// clave pedida con la ultima recibida, asi el efecto no necesita tocar el estado al iniciar.
export function useConsulta(ruta, parametros) {
  const [version, setVersion] = useState(0);
  const [resultado, setResultado] = useState({ clave: null, respuesta: null, error: null });

  const clave = JSON.stringify({ ruta, parametros, version });

  useEffect(() => {
    let vigente = true;
    const pedido = JSON.parse(clave);

    api
      .get(pedido.ruta, { params: pedido.parametros })
      .then(({ data }) => {
        if (vigente) setResultado({ clave, respuesta: data, error: null });
      })
      .catch((error) => {
        if (vigente) {
          setResultado((actual) => ({ ...actual, clave, error: leerError(error).mensaje }));
        }
      });

    return () => {
      vigente = false;
    };
  }, [clave]);

  const recargar = useCallback(() => setVersion((actual) => actual + 1), []);

  return {
    respuesta: resultado.respuesta,
    error: resultado.error,
    // Primera carga: no hay nada que mostrar todavia
    cargando: resultado.clave === null,
    // Hay datos en pantalla y llegan otros mas nuevos
    actualizando: resultado.clave !== null && resultado.clave !== clave,
    recargar,
  };
}
