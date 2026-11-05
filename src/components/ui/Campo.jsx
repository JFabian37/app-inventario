import { useId } from 'react';
import estilos from './Campo.module.css';

// Etiqueta, mensaje y atributos de accesibilidad comunes a todos los controles.
// children recibe las props que debe aplicar a su control.
export default function Campo({ label, error, ayuda, id, className = '', children }) {
  const idGenerado = useId();
  const idCampo = id ?? idGenerado;
  const idMensaje = `${idCampo}-mensaje`;
  const mensaje = error || ayuda;

  return (
    <div className={`${estilos.campo} ${className}`}>
      <label className={estilos.etiqueta} htmlFor={idCampo}>
        {label}
      </label>
      {children({
        id: idCampo,
        className: `${estilos.control} ${error ? estilos.conError : ''}`,
        'aria-invalid': Boolean(error),
        'aria-describedby': mensaje ? idMensaje : undefined,
      })}
      {mensaje && (
        <p id={idMensaje} className={error ? estilos.error : estilos.ayuda}>
          {mensaje}
        </p>
      )}
    </div>
  );
}
