import { useState } from 'react';
import { leerError } from '../utils/errores.js';

// Estado, validacion y envio comunes. Los errores por campo de la API (detalles) se
// pintan en el mismo lugar que los de la validacion del cliente.
export function useFormulario({ inicial, validar, enviar, alCompletar }) {
  const [valores, setValores] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);

  const alCambiar = ({ target: { name, type, checked, value } }) => {
    setValores((actuales) => ({ ...actuales, [name]: type === 'checkbox' ? checked : value }));
    setErrores((actuales) => ({ ...actuales, [name]: undefined }));
  };

  const alEnviar = async (evento) => {
    evento.preventDefault();
    setErrorGeneral('');

    const encontrados = validar?.(valores) ?? {};
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setEnviando(true);
    try {
      alCompletar(await enviar(valores));
    } catch (error) {
      const { mensaje, detalles } = leerError(error);
      setErrores(detalles);
      setErrorGeneral(mensaje);
      setEnviando(false);
    }
  };

  // Props de un campo: <Input {...campo('nombre')} label="Nombre" />
  const campo = (nombre) => ({
    name: nombre,
    value: valores[nombre],
    onChange: alCambiar,
    error: errores[nombre],
  });

  return { valores, errores, errorGeneral, enviando, alCambiar, alEnviar, campo };
}
