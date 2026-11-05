import { useId, useLayoutEffect, useRef } from 'react';
import Icono from './Icono.jsx';
import estilos from './Modal.module.css';

// <dialog> nativo: el navegador atrapa el foco, cierra con Escape y lo devuelve al cerrar
export default function Modal({ titulo, alCerrar, angosto = false, children }) {
  const dialogo = useRef(null);
  const idTitulo = useId();

  // Layout effect: la limpieza corre con el dialogo aun en el DOM. close() sobre un
  // elemento ya retirado no devuelve el foco a quien lo abrio.
  useLayoutEffect(() => {
    const elemento = dialogo.current;
    elemento.showModal();
    // autoFocus corre antes de abrir, cuando el dialogo aun no acepta foco
    elemento.querySelector('[data-foco-inicial]')?.focus();
    return () => elemento.close();
  }, []);

  const alCancelar = (evento) => {
    // Quien abre el modal decide cuando se desmonta
    evento.preventDefault();
    alCerrar();
  };

  return (
    <dialog
      ref={dialogo}
      className={angosto ? `${estilos.modal} ${estilos.angosto}` : estilos.modal}
      aria-labelledby={idTitulo}
      onCancel={alCancelar}
    >
      <div className={estilos.cabecera}>
        <h2 id={idTitulo} className={estilos.titulo}>
          {titulo}
        </h2>
        <button type="button" className={estilos.cerrar} onClick={alCerrar} aria-label="Cerrar">
          <Icono nombre="cerrar" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
