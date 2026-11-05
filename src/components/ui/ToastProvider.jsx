import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ToastContexto } from '../../hooks/useToast.js';
import Icono from './Icono.jsx';
import estilos from './ToastProvider.module.css';

const DURACION_MS = 4000;

let siguienteId = 1;

export default function ToastProvider({ children }) {
  const [avisos, setAvisos] = useState([]);
  const contenedor = useRef(null);

  const quitar = useCallback((id) => {
    setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id));
  }, []);

  const agregar = useCallback(
    (tipo, mensaje) => {
      const id = siguienteId++;
      setAvisos((actuales) => [...actuales, { id, tipo, mensaje }]);
      setTimeout(() => quitar(id), DURACION_MS);
    },
    [quitar],
  );

  // Un <dialog> abierto tapa todo lo demas. Como popover, el contenedor entra en la misma
  // capa superior; volver a mostrarlo lo deja encima del ultimo modal abierto.
  useEffect(() => {
    const elemento = contenedor.current;
    if (elemento.matches(':popover-open')) elemento.hidePopover();
    if (avisos.length > 0) elemento.showPopover();
  }, [avisos]);

  const valor = useMemo(
    () => ({
      exito: (mensaje) => agregar('exito', mensaje),
      error: (mensaje) => agregar('error', mensaje),
    }),
    [agregar],
  );

  return (
    <ToastContexto.Provider value={valor}>
      {children}
      <div ref={contenedor} popover="manual" className={estilos.contenedor}>
        {avisos.map(({ id, tipo, mensaje }) => (
          <div
            key={id}
            className={`${estilos.aviso} ${estilos[tipo]}`}
            role={tipo === 'error' ? 'alert' : 'status'}
          >
            <p>{mensaje}</p>
            <button
              type="button"
              className={estilos.cerrar}
              onClick={() => quitar(id)}
              aria-label="Cerrar aviso"
            >
              <Icono nombre="cerrar" tamano={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContexto.Provider>
  );
}
