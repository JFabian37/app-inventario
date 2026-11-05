import Icono from './Icono.jsx';
import estilos from './EmptyState.module.css';

export default function EmptyState({ icono = 'productos', titulo, mensaje, children }) {
  return (
    <div className={estilos.vacio}>
      <span className={estilos.icono}>
        <Icono nombre={icono} tamano={24} />
      </span>
      <p className={estilos.titulo}>{titulo}</p>
      {mensaje && <p className={estilos.mensaje}>{mensaje}</p>}
      {children}
    </div>
  );
}
