import estilos from './EncabezadoPagina.module.css';

export default function EncabezadoPagina({ titulo, descripcion, children }) {
  return (
    <div className={estilos.encabezado}>
      <div>
        <h1 className={estilos.titulo}>{titulo}</h1>
        {descripcion && <p className={estilos.descripcion}>{descripcion}</p>}
      </div>
      {children}
    </div>
  );
}

// Fila de busqueda y filtros, encima de la tabla
export function Herramientas({ children }) {
  return <div className={estilos.herramientas}>{children}</div>;
}
