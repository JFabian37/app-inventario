import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/auth.js';
import Icono from '../ui/Icono.jsx';
import { NAVEGACION } from './navegacion.js';
import estilos from './Sidebar.module.css';

export default function Sidebar({ id, colapsado, abierto, alCerrar }) {
  const { tienePermiso } = useAuth();
  const visibles = NAVEGACION.filter(({ roles = [] }) => tienePermiso(...roles));

  const clases = [estilos.sidebar, colapsado && estilos.colapsado, abierto && estilos.abierto]
    .filter(Boolean)
    .join(' ');

  return (
    <aside id={id} className={clases}>
      <div className={estilos.marca}>
        <span className={estilos.logo}>
          <Icono nombre="productos" tamano={22} />
        </span>
        <span className={estilos.nombre}>Panel de Inventario</span>
        <button type="button" className={estilos.cerrar} onClick={alCerrar} aria-label="Cerrar menú">
          <Icono nombre="cerrar" />
        </button>
      </div>

      <nav aria-label="Menú principal">
        <ul className={estilos.lista}>
          {visibles.map(({ ruta, etiqueta, icono }) => (
            <li key={ruta}>
              <NavLink
                to={ruta}
                end={ruta === '/'}
                title={colapsado ? etiqueta : undefined}
                onClick={alCerrar}
                className={({ isActive }) =>
                  isActive ? `${estilos.enlace} ${estilos.activo}` : estilos.enlace
                }
              >
                <Icono nombre={icono} />
                <span className={estilos.etiqueta}>{etiqueta}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
